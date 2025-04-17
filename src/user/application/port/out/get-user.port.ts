import { User } from "../../domain/model/user.aggregat";

export interface GetUserPort {
  getById(id: string): Promise<User>;
}