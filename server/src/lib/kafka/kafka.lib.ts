import { Kafka, Producer, Consumer } from "kafkajs";
import { KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_PARTITIONS1, KAFKA_PARTITIONS2, KAFKA_TOPIC1, KAFKA_TOPIC2 } from "../../config/config.js";
import { K } from "handlebars";

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
        { topic: KAFKA_TOPIC1, numPartitions: KAFKA_PARTITIONS1 },
        { topic: KAFKA_TOPIC2, numPartitions: KAFKA_PARTITIONS2 },
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
