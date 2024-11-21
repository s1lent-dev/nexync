import { Kafka, Producer, Consumer } from "kafkajs";
import { KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_PARTITIONS1, KAFKA_PARTITIONS2, KAFKA_PASSWORD, KAFKA_TOPIC1, KAFKA_TOPIC2, KAFKA_USERNAME } from "../../config/config.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


class KafkaService {
  private kafka: Kafka;
  protected producer: Producer;

  constructor() {
    // const __filename = fileURLToPath(import.meta.url); // Get the full path of the current file
    // const __dirname = path.dirname(__filename); // Get the directory name
    this.kafka = new Kafka({
      clientId: KAFKA_CLIENT_ID,
      brokers: [KAFKA_BROKER],
      ssl: {
        ca: [`-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUU4kCHquZrAk+W53SF47tgeu+NcswDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMDc0MzIxMGItN2I1OC00ZjE2LTgzMWUtMzM0NTAzYTJi
MjI1IFByb2plY3QgQ0EwHhcNMjQwOTE2MDgwMTUyWhcNMzQwOTE0MDgwMTUyWjA6
MTgwNgYDVQQDDC8wNzQzMjEwYi03YjU4LTRmMTYtODMxZS0zMzQ1MDNhMmIyMjUg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAOvXdr1V
rSG6+IeavHTvwkYYAJUXs58fGwov6YyInu7UXp1lB2/+ClG5PdqlFxZaRa2sh3rz
wfyXmJOr9wuRLECVLRqIvStq+B5DCBy34cZ5hY1NrOC0yW4OPhs9uvUWkYuyUo68
olrzPrAcNplBX/AxTISsX2ma/XFW70XDr9jFV7rqEAYtaZ7pG64ytf31c3XGlHtd
5O8+FJvUNGq2PdOe27o8cILAS7c3FJZCnSLd9HOfRqsBQaQlmVXMZE+wLPz0ZOlF
DPiuIywfxZlCt4A+Uja6uJ3D+GgJ4ymnhrreZ4FcXv18QiBs4PvpH6VKo/pafFg0
MyF4yoqpdfx/B2jW0/yov/LFLkI0xCYHhhO3Chpk4wy87LDi8xofm6wSNgH2cbrS
J3YX1B20JEWt20DW9VqtDqnL4d9AViO8jZ5w8hpzWqKQYSFyK5uZquW11hhQKbMd
1zau141aQgaBniHSHp4YWn/8aoc2UHc+GVumXB2h90ovazI4FglPS+WCCwIDAQAB
oz8wPTAdBgNVHQ4EFgQUiyq8l4V+UAOskKhs5kpbg46QvrIwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAAYBQzx9pknpfqvW
yJQxKJpKEYQW9Iupqt9S6s+d2LA1ZZDsFzaNsxsP2VFpuvPqtmXc+5io/7updZRO
v4YM7uhiGAkt/MIMUbPcrJZPevQhFOJ+M2iN0breN4D4RFW3mUrdeknpxMeoErnN
F/uR/IfSM+7L22GbrU0uTNJGH47xpqqPTrZsEkJbr3PoKXyhcXqQeaq3rDA2Ytcz
BUFQqVAUnfdJdcZKvXmlrkXz0KHC7CRBs0X74VoNroqv71Hf1EoNKUJVi6QaHnFB
siiOJJYu0jko3WXb1D34AR2y44Hd9tbBodSwO2tU21hc77euOHLz2D9E12ROmqw+
aMpYPRagooNrBEErY4UXjpzmVOjvRFIFAaDiHk2DsoXNl8VeG/ZA/te0nVAewmyS
dxGay6X7hjNHY7UJNaYUY/3ScPWKLjQxOD5P+Nm17N2z9CD0IDa+EHWWV0DLCCLf
+J73Zghlyl9QCdYm3E3gNPJg9Fb1LnNTVu+W7GqfwtUCZOb8MA==
-----END CERTIFICATE-----
`],
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
