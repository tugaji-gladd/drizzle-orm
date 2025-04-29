import { Inject, Injectable } from '@nestjs/common';
import { UserUseCase } from '../../port/in/user.usecase';
import { User } from '../model/user.aggregat';
import { UserRepository } from 'src/user/adapter/out/repository/user.repository';

@Injectable()
export class UserService implements UserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) { }

  async create(name: string): Promise<void> {
    await this.userRepository.save(name);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.getById(id);
    return user;
  }
}
