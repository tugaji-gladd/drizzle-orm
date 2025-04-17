export class User {
  constructor(
    private readonly id: string,
    private readonly name: string,
  ) { }

  public static init(id: string, name: string): User {
    return new User(id, name);
  }
}