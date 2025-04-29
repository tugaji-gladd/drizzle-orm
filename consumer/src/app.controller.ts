import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Payload, Ctx, KafkaContext, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('app.public.user')
  handleMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    console.log('kafka consumer Received message', message);
    // メッセージの処理ロジック
  }
}
