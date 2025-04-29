import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import * as schema from './db/schema';

@Module({
  imports: [
    UserModule,
    DrizzlePostgresModule.register({
      tag: 'DB_DEV',
      postgres: {
        url: process.env.DATABASE_URL!,
      },
      config: { schema: { ...schema } },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
