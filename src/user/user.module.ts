import { Module } from '@nestjs/common';
import { UserController } from './adapter/in/user.controller';
import { UserService } from './application/domain/service/user.service';
import { UserRepository } from './adapter/out/repository/user.repository';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'UserService',
      useClass: UserService,
    },
    {
      provide: 'UserUseCase',
      useClass: UserService,
    },
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UserModule { }
