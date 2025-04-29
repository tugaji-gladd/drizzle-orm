import { User } from "../../domain/model/user.aggregat";

export interface GetUserPort {
  getById(id: number): Promise<User>;
}