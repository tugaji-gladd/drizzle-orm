import { User } from "../../domain/model/user.aggregat";

export interface SaveUserPort {
  save(user: User): Promise<void>;
}