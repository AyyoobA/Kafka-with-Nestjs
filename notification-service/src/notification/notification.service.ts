import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EachMessagePayload, Kafka } from 'kafkajs';

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy{
  private readonly kafka = new Kafka({brokers: ['localhost:9092']})
  private readonly producer = this.kafka.producer();
  private readonly consumer = this.kafka.consumer({groupId: 'notification-service'})

  onModuleInit() {
    this.producer.connect()
    this.consumer.connect()
    this.consumeMessage()
  }

  onModuleDestroy() {
    this.producer.disconnect()
    this.consumer.disconnect()
  }

  async consumeMessage(){
    await this.consumer.subscribe({topic: 'order.service', fromBeginning: true})

    await this.consumer.run({
      eachMessage : async ({topic, partition, message} : EachMessagePayload) => {
        console.log({
          value: message.value?.toString()
        })

        this.consumer.pause([{topic}]);

        setTimeout(() => {
          this.consumer.resume([{topic}])
        }, 10000);

        try {
          if(message.value){
            const {customerName, email, address} = JSON.parse(message.value.toString());
            console.log(customerName, email, address)
          }
        } catch(error) {
          console.log('error: ' , error)
        }
      }})
  }
}
