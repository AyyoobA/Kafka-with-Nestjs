import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Admin, Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class OrderService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092']
  })
  private readonly producer : Producer = this.kafka.producer();
  private readonly consumer : Consumer = this.kafka.consumer({groupId: 'order-service'});
  private readonly admin : Admin = this.kafka.admin();

  onModuleInit() {
    this.producer.connect();
    this.consumer.connect();
    this.admin.createPartitions({
      topicPartitions: [{
        topic: 'order.service',
        count: 3,
      }]
    })
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
