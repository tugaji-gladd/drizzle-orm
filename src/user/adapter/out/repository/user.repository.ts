import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/application/domain/model/user.aggregat';
import { GetUserPort } from 'src/user/application/port/out/get-user.port';
import { SaveUserPort } from 'src/user/application/port/out/save-user.port';
import * as schema from 'src/db/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository implements GetUserPort, SaveUserPort {
  constructor(
    @Inject('DB_DEV') private readonly db: PostgresJsDatabase<typeof schema>,
  ) { }

  async getById(id: number): Promise<User> {
    const result = this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, id)) // 1は仮実装
      .execute();
    const user = User.init(result[0].id, result[0].name);
    return user;
  }

  async save(name: string): Promise<void> {
    const result = this.db.insert(schema.user).values({
      name: name,
    }).execute();

    console.log(result);
  }
}
