import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
    // create a brocker
    private readonly kafka = new Kafka({
        brokers: ['localhost:9092']
    })

    async onModuleInit() {
       await this.producer.connect()
    }

    async onApplicationShutdown() {
        await this.producer.disconnect();
    }

    // create a producer 
    private readonly producer : Producer = this.kafka.producer()

    async produce(record: ProducerRecord) {
        await this.producer.send(record);
    }
}
