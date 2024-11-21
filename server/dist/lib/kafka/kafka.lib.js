import { Kafka } from "kafkajs";
import { KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_PARTITIONS1, KAFKA_PARTITIONS2, KAFKA_PASSWORD, KAFKA_TOPIC1, KAFKA_TOPIC2, KAFKA_USERNAME } from "../../config/config.js";
import fs from 'fs';
import path from 'path';
class KafkaService {
    constructor() {
        this.kafka = new Kafka({
            clientId: KAFKA_CLIENT_ID,
            brokers: [KAFKA_BROKER],
            ssl: {
                ca: [fs.readFileSync(path.resolve('./ca.pem'), "utf-8")],
            },
            sasl: {
                username: KAFKA_USERNAME,
                password: KAFKA_PASSWORD,
                mechanism: "plain",
            }
        });
        this.initAdmin();
        this.producer = this.kafka.producer();
        this.producer.connect().then(() => console.log("Kafka Producer connected"));
    }
    async initAdmin() {
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
    createConsumer(groupId) {
        const consumer = this.kafka.consumer({ groupId });
        consumer.connect().then(() => console.log(`${groupId} consumer connected`));
        return consumer;
    }
    async disconnect() {
        await this.producer.disconnect();
    }
}
export { KafkaService };
