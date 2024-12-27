import { Kafka } from "kafkajs";
import { KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_PARTITIONS1, KAFKA_PARTITIONS2, KAFKA_TOPIC1, KAFKA_TOPIC2 } from "../../config/config.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
class KafkaService {
    constructor() {
        this.kafka = new Kafka({
            clientId: KAFKA_CLIENT_ID,
            brokers: [KAFKA_BROKER],
            ssl: {
                ca: fs.readFileSync(path.resolve(__dirname, "../../../certs/ca.pem"), "utf-8"),
                key: fs.readFileSync(path.resolve(__dirname, "../../../certs/service.key"), "utf-8"),
                cert: fs.readFileSync(path.resolve(__dirname, "../../../certs/service.cert"), "utf-8"),
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
