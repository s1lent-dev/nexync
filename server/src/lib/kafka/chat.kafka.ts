import { KafkaService } from "./kafka.lib.js";
import { MessageEvent } from "../../types/types.js";
import { prisma } from "../db/prisma.db.js";
import { KAFKA_GROUP_ID, KAFKA_TOPIC } from "../../config/config.js";

class ChatKafkaService extends KafkaService {

  private consumer = this.createConsumer(KAFKA_GROUP_ID);
  private topic = KAFKA_TOPIC;

  constructor() {
    super();
  }

  async publishMessage(message: MessageEvent) {
    await this.producer.send({
      topic: this.topic,
      messages: [{ key: `msg-${Date.now()}`, value: JSON.stringify(message) }],
    });
    console.log("Message published to Kafka:", message);
  }

  async consumeMessages() {
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message, pause }) => {
        try {
            const messageValue = message.value ? message.value.toString() : "null";
            const msg = await JSON.parse(messageValue) as MessageEvent;
            const chat = await prisma.chat.findFirst({
                where: { chatId: msg.chatId}
            });           

            if (!chat) {
                console.log("Chat not found.");
                return;
            }

            await prisma.message.create({
                data: {
                    content: msg.content,
                    senderId: msg.senderId,
                    chatId: chat.chatId,
                    messageType: "TEXT",
                }
            });
            console.log("Message consumed from Kafka:", msg);
        } catch (err: any) {
            console.error("Error consuming message: ", err);
            pause();
            setTimeout(() => {
                console.log("Resuming consumer...");
                this.consumer.resume([{ topic }]);
            }, 5000);
        }
      },
    });
  }
}

export { ChatKafkaService };
