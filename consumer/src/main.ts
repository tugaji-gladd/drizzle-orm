import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // consumerの起動
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['broker1:9092', 'broker2:9093'],
      },
      consumer: {
        groupId: 'app_consumer-group',
      },
    },
  });
  await app.startAllMicroservices();
  console.log('Kafka Consumer is starting...');

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
