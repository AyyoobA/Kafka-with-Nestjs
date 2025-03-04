import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class OrderService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092']
  })
  private readonly producer : Producer = this.kafka.producer();
  private readonly consumer : Consumer = this.kafka.consumer({groupId: 'order-service'})

  onModuleInit() {
    this.producer.connect();
    this.consumer.connect();
  }

  onModuleDestroy() {
    this.producer.disconnect();
    this.consumer.disconnect();
  }
  
  create(createOrderDto: CreateOrderDto) {
    this.producer.send({
      topic: 'order.service',
      messages: [
        {value: JSON.stringify(createOrderDto)}
      ]
    })
  }
}
