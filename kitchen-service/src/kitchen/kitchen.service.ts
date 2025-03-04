import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KitchenService implements OnModuleInit, OnModuleDestroy{
  private readonly kafka = new Kafka({brokers: ['localhost:9092']})
  private readonly producer = this.kafka.producer();
  private readonly consumer = this.kafka.consumer({groupId: "kitchen-service"})

  onModuleInit() {
    this.consumer.connect();
    this.producer.connect();
    this.consumeMessage();
  }

  onModuleDestroy() {
    this.consumer.disconnect();
    this.producer.disconnect();
  }
  
  async consumeMessage(){
    this.consumer.subscribe({topic: 'order.service', fromBeginning:  true});

    this.consumer.run({
      eachMessage : async ({topic, partition, message}) => {
        console.log({
          value: message.value?.toString()
        })
      }
    })
  }
}
