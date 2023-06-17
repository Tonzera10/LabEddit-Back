import { PostDB } from "../models/Post";
import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  private TABLE_NAME = "users";

  public getAllUsers = async (): Promise<UserDB[]> => {
    const userDB = await BaseDatabase.connection(this.TABLE_NAME);
    return userDB;
  };

  public findById = async (id: string): Promise<PostDB | undefined> => {
    const [postDB] = await BaseDatabase.connection(this.TABLE_NAME).where({
      id,
    });
    return postDB as PostDB | undefined;
  };

  public findByEmail = async (email: string): Promise<UserDB | undefined> => {
    const [userDB] = await BaseDatabase.connection(this.TABLE_NAME).where({
      email,
    });
    return userDB as UserDB | undefined;
  };

  public insertUser = async (userDB: UserDB): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_NAME).insert(userDB);
  };
}
