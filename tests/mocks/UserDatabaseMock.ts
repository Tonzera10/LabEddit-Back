import { UserDB } from "../../src/models/User";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const usersMock: UserDB[] = [
  {
    id: "id-mock-ton",
    name: "tonzera",
    email: "everton@email.com",
    password: "hash-mock-ton",
  },
  {
    id: "id-mock-jeff",
    name: "jeff",
    email: "jeff@email.com",
    password: "hash-mock-jeff",
  },
];

export class UserDatabaseMock extends BaseDatabase {
  public getAllUsers = async (): Promise<UserDB[]> => {
    return usersMock;
  };

  public findByEmail = async (email: string): Promise<UserDB | undefined> => {
    return usersMock.filter((user) => user.email === email)[0];
  };

  public findById = async (id: string): Promise<UserDB> => {
    return usersMock.filter((user) => user.id === id)[0];
  };

  public insertUser = async (userDB: UserDB): Promise<void> => {};
}
