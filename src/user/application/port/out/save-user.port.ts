import { User } from "../../domain/model/user.aggregat";

export interface SaveUserPort {
  save(name: string): Promise<void>;
}