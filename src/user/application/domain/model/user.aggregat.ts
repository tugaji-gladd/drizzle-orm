export class User {
  constructor(
    private readonly id: number,
    private readonly name: string,
  ) { }

  public static init(id: number, name: string): User {
    return new User(id, name);
  }
}