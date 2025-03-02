import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
    private readonly kafka = new Kafka({
        brokers: ['localhost:9092']
    })

    async onApplicationShutdown() {
        for(const consumer of this.consumers){
           await consumer.disconnect()
        }
    }

    private readonly consumers: Consumer[] = []

    async consume(groupId: string, topic : ConsumerSubscribeTopics , config: ConsumerRunConfig){
        const consumer: Consumer = this.kafka.consumer({groupId : groupId})
        await consumer.connect().catch(error => console.log(error))
        await consumer.subscribe(topic)
        await consumer.run(config)
        this.consumers.push(consumer);
    }
}
