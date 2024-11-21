import amqp from "amqplib";
import { RABBITMQ_URL } from "../../config/config.js";
class RabbitMQService {
    constructor() {
    }
    async connect() {
        this.connection = await amqp.connect(RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
        console.log("Connected to RabbitMQ");
    }
    async createQueue(queue) {
        await this.channel?.assertQueue(queue);
        console.log(`Queue ${queue} created or already exists`);
    }
    async publishMessage(queue, message) {
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`Message sent to queue ${queue}`, message);
    }
    async consumeMessage(queue, handler) {
        await this.channel.consume(queue, (msg) => {
            if (msg) {
                handler(msg);
                this.channel.ack(msg);
            }
        });
        console.log(`Consumer set up for queue ${queue}`);
    }
}
export { RabbitMQService };
