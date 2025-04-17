import { User } from "../../domain/model/user.aggregat";

export interface UserUseCase {
  create(id: string, name: string): Promise<void>;
  findById(id: string): Promise<User>;
}