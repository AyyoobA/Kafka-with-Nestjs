import { Controller, Post, Body } from '@nestjs/common';
import { KitchenService } from './kitchen.service';

@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}
 
}
