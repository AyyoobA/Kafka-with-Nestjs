import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [KafkaModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
