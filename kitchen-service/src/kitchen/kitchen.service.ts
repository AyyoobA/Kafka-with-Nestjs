import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kafka } from 'kafkajs';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class KitchenService implements OnModuleInit, OnModuleDestroy{
  private readonly kafka = new Kafka({brokers: ['localhost:9092']})
  private readonly producer = this.kafka.producer();
  private readonly consumer = this.kafka.consumer({groupId: "kitchen-service"})

  constructor(@InjectRepository(Order) private readonly kitchenRepository: Repository<Order>){}

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

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log({ value: message.value?.toString() });
    
          if (!message.value) {
            console.error("Received null or undefined message value");
            return;
          }
    
          let order: Order | null = null;
    
          try {
            order = JSON.parse(message.value.toString());
          } catch (error) {
            console.error("Failed to parse message:", error);
            return; 
          }
    
          if (!order || !order.id) {
            console.error("Invalid order data:", order);
            return;
          }
    
          const exist = await this.kitchenRepository.findOne({ where: { id: order.id } });
    
          if (!exist) {
            const orderCreate = this.kitchenRepository.create(order);
            await this.kitchenRepository.save(orderCreate);
            console.log("Order saved successfully:", orderCreate);
          } else {
            console.log("Order already exists:", exist);
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
    });
  }
}