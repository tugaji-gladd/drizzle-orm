import { User } from "../../domain/model/user.aggregat";

export interface UserUseCase {
  create(name: string): Promise<void>;
  findById(id: number): Promise<User>;
}