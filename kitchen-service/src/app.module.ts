import { Module } from '@nestjs/common';
import { KitchenModule } from './kitchen/kitchen.module';

@Module({
  imports: [KitchenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
