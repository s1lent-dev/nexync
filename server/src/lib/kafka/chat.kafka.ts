import { KafkaService } from "./kafka.lib.js";
import { Chat, ChatType, MessageEvent } from "../../types/types.js";
import { prisma } from "../db/prisma.db.js";
import { pubsub } from "../../app.js";
import { KAFKA_GROUP_ID1, KAFKA_GROUP_ID2, KAFKA_TOPIC1, KAFKA_TOPIC2 } from "../../config/config.js";

class ChatKafkaService extends KafkaService {

  private consumer1 = this.createConsumer(KAFKA_GROUP_ID1);
  private consumer2 = this.createConsumer(KAFKA_GROUP_ID2);
  private topic1 = KAFKA_TOPIC1;
  private topic2 = KAFKA_TOPIC2;

  constructor() {
    super();
  }

  async publishMessage(message: MessageEvent) {
    await this.producer.send({
      topic: this.topic1,
      messages: [{ key: `msg-${Date.now()}`, value: JSON.stringify(message) }],
    });
    console.log("Message published to Kafka:", message);
  }

  async consumeMessages() {
    await this.consumer1.subscribe({ topic: this.topic1, fromBeginning: true });
    await this.consumer1.run({
      eachMessage: async ({ topic, partition, message, pause }) => {
        try {
          const messageValue = message.value ? message.value.toString() : "null";
          const msg = await JSON.parse(messageValue) as MessageEvent;

          const { senderId, username, chatId, messageType, memberIds, content, status, createdAt } = msg;
          const chat = await prisma.chat.findFirst({
            where: { chatId: msg.chatId }
          });

          if (!chat) {
            console.log("Chat not found.");
            return;
          }

          const realMessage = await prisma.message.create({
            data: {
              content: content,
              senderId: senderId,
              chatId: chatId,
              messageType: "TEXT",
              status: status,
            }
          });

          const messageId = realMessage.messageId;
          await pubsub.publish("messages", JSON.stringify({ senderId, messageId, username, messageType, chatId, memberIds, content, status, createdAt }));

          console.log("Message consumed from Kafka:", msg);
        } catch (err: any) {
          console.error("Error consuming message: ", err);
          pause();
          setTimeout(() => {
            console.log("Resuming consumer...");
            this.consumer1.resume([{ topic }]);
          }, 5000);
        }
      },
    });
  }


  async publishMessageRead(message: { chatId: string, senderId: string, messageIds: string[], readBy: string, chatType: ChatType }) {
    await this.producer.send({
      topic: this.topic2,
      messages: [{ key: `msg-${Date.now()}`, value: JSON.stringify(message) }],
    });
    console.log("Message read published to Kafka:", message);
  }

  async consumeMessageRead() {
    await this.consumer2.subscribe({ topic: this.topic2, fromBeginning: true });
    await this.consumer2.run({
      eachMessage: async ({ topic, partition, message, pause }) => {
        try {
          const messageValue = message.value ? message.value.toString() : "null";
          const msg = JSON.parse(messageValue) as { 
            chatId: string; 
            senderId: string; 
            messageIds: string[]; 
            readBy: string; 
            chatType: ChatType; 
          };
  
          const { chatId, messageIds, readBy, chatType, senderId } = msg;
  
          console.log("Message read consumed from Kafka:", msg);
  
          const chat = await prisma.chat.findUnique({
            where: { chatId },
            include: { users: true },
          });
  
          if (!chat) {
            console.log("Chat not found.");
            return;
          }
  
          if (chatType === "PRIVATE") {
            await prisma.message.updateMany({
              where: {
                chatId,
                messageId: { in: messageIds },
              },
              data: { status: "READ" },
            });
          
            await pubsub.publish("message-read", JSON.stringify({ chatId, senderId, messageIds }));
          } else {
            const readMessageIds: string[] = [];
          
            await prisma.messageRead.createMany({
              data: messageIds.map((messageId) => ({
                chatId,
                userId: readBy,
                messageId,
                readAt: new Date(),
              })),
              skipDuplicates: true,
            });
          
            for (const messageId of messageIds) {
              const senderIdForMessage = await prisma.message.findUnique({
                where: { messageId },
                select: { senderId: true },
              }).then((message) => message?.senderId);
          
              const unreadMembersCount = await prisma.userChat.count({
                where: {
                  chatId,
                  userId: {
                    notIn: await prisma.messageRead.findMany({
                      where: { chatId, messageId },
                      select: { userId: true },
                    }).then((reads) => reads.map((r) => r.userId)),
                    not: senderIdForMessage,
                  },
                },
              });
          
              if (unreadMembersCount === 0) {
                await prisma.message.update({
                  where: { messageId },
                  data: { status: "READ" },
                });
                readMessageIds.push(messageId);
              }
            }
          
            await pubsub.publish("message-read", JSON.stringify({ chatId, senderId, messageIds: readMessageIds }));
          }
  
          console.log("Message read processing completed:", msg);
        } catch (err) {
          console.error("Error consuming message read: ", err);
          pause();
          setTimeout(() => {
            console.log("Resuming consumer...");
            this.consumer2.resume([{ topic }]);
          }, 5000);
        }
      },
    });
  }
  
}

export { ChatKafkaService };
