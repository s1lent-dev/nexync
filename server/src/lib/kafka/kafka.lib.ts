import { Kafka, Producer, Consumer } from "kafkajs";
import { KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_PARTITIONS, KAFKA_TOPIC } from "../../config/config.js";

class KafkaService {
  private kafka: Kafka;
  protected producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: KAFKA_CLIENT_ID,
      brokers: [KAFKA_BROKER],
    });
    this.initAdmin();
    this.producer = this.kafka.producer();
    this.producer.connect().then(() => console.log("Kafka Producer connected"));
  }

  private async initAdmin() {
    const admin = this.kafka.admin();
    await admin.connect();
    console.log("Kafka Admin connected");

    await admin.createTopics({
      topics: [
        { topic: KAFKA_TOPIC, numPartitions: KAFKA_PARTITIONS },
      ],
    });
    await admin.disconnect();
  }

  protected createConsumer(groupId: string): Consumer {
    const consumer = this.kafka.consumer({ groupId });
    consumer.connect().then(() => console.log(`${groupId} consumer connected`));
    return consumer;
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}

export { KafkaService };
