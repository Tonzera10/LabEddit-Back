import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_NAME = "users";

  public getAllUsers = async (): Promise<UserDB[]> => {
    const userDB = await BaseDatabase.connection(UserDatabase.TABLE_NAME);
    return userDB;
  };

  public findByEmail = async (email: string): Promise<UserDB | undefined> => {
    const [userDB] = await BaseDatabase.connection(
      UserDatabase.TABLE_NAME
    ).where({
      email,
    });
    return userDB as UserDB | undefined;
  };

  public findById = async (id: string): Promise<UserDB> => {
    const [userDB] = await BaseDatabase.connection(
      UserDatabase.TABLE_NAME
    ).where({
      id,
    });
    return userDB;
  };

  public insertUser = async (userDB: UserDB): Promise<void> => {
    await BaseDatabase.connection(UserDatabase.TABLE_NAME).insert(userDB);
  };
}
