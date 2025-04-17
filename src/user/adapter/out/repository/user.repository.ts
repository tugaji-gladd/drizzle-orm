import { Injectable } from '@nestjs/common';
import { User } from 'src/user/application/domain/model/user.aggregat';
import { GetUserPort } from 'src/user/application/port/out/get-user.port';
import { SaveUserPort } from 'src/user/application/port/out/save-user.port';

@Injectable()
export class UserRepository implements GetUserPort, SaveUserPort {
  async getById(id: string): Promise<User> {
    // 仮実装
    const name = 'John Doe';
    const user = User.init(id, name);
    return user;
  }

  async save(user: User): Promise<void> {

  }
}
