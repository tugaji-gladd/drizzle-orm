import { Inject, Injectable } from '@nestjs/common';
import { UserUseCase } from '../../port/in/user.usecase';
import { User } from '../model/user.aggregat';
import { UserRepository } from 'src/user/adapter/out/repository/user.repository';

@Injectable()
export class UserService implements UserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) { }

  async create(id: string, name: string): Promise<void> {
    const u = User.init(id, name);
    await this.userRepository.save(u);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);
    return user;
  }
}
