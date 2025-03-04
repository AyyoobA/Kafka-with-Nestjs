import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Kafka } from 'kafkajs';

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

  consumeMessage(){
    this.consumer.subscribe({topic: 'order.service', fromBeginning: true})

    this.consumer.run({
      eachMessage : async ({topic, partition, message}) => {
        console.log({
          value: message.value?.toString()
        })
      }})
  }
}
