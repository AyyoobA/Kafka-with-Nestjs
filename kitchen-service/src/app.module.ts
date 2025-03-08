import { Module } from '@nestjs/common';
import { KitchenModule } from './kitchen/kitchen.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kitchen } from './kitchen/entities/kitchen.entity';
import { Order } from './kitchen/entities/order.entity';

@Module({
  imports: [KitchenModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'kafka',
    entities: [Order],
    synchronize: true
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
