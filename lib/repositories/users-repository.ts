import type { User, UserInput } from "../models/user";

export interface UsersRepository {
  create(input: UserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

export class MockUsersRepository implements UsersRepository {
  async create(input: UserInput): Promise<User> {
    return {
      id: input.id,
      email: input.email,
      name: input.name ?? null,
      createdAt: new Date().toISOString(),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return null;
  }
}
