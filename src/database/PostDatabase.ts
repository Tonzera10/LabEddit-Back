import {
  POST_LIKE,
  PostDB,
  PostDBWithCreatorName,
  likeDislikeDB,
} from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
  private TABLE_POSTS = "posts";
  private TABLE_USERS = "users";
  private TABLE_LIKES_DISLIKES = "likes_dislikes";

  public getPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const result = await BaseDatabase.connection(this.TABLE_POSTS)
      .select(
        `${this.TABLE_POSTS}.id`,
        `${this.TABLE_POSTS}.creator_id`,
        `${this.TABLE_POSTS}.content`,
        `${this.TABLE_POSTS}.likes`,
        `${this.TABLE_POSTS}.dislikes`,
        `${this.TABLE_POSTS}.created_at`,
        `${this.TABLE_POSTS}.updated_at`,
        `${this.TABLE_USERS}.name as creator_name`
      )
      .innerJoin(
        `${this.TABLE_USERS}`,
        `${this.TABLE_POSTS}.creator_id`,
        "=",
        `${this.TABLE_USERS}.id`
      );

    return result as PostDBWithCreatorName[];
  };

  public findById = async (id: string): Promise<PostDB | undefined> => {
    const [postDB] = await BaseDatabase.connection(this.TABLE_POSTS).where({
      id,
    });
    return postDB;
  };

  public insertPost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_POSTS).insert(postDB);
  };

  public updatePost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_POSTS)
      .update(postDB)
      .where({ id: postDB.id });
  };

  public deletePost = async (id: string): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_POSTS).delete().where({ id });
  };

  public findPostWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const [result] = await BaseDatabase.connection(this.TABLE_POSTS)
      .select(
        `${this.TABLE_POSTS}.id`,
        `${this.TABLE_POSTS}.creator_id`,
        `${this.TABLE_POSTS}.content`,
        `${this.TABLE_POSTS}.likes`,
        `${this.TABLE_POSTS}.dislikes`,
        `${this.TABLE_POSTS}.created_at`,
        `${this.TABLE_POSTS}.updated_at`,
        `${this.TABLE_USERS}.name as creator_name`
      )
      .innerJoin(
        `${this.TABLE_USERS}`,
        `${this.TABLE_POSTS}.creator_id`,
        "=",
        `${this.TABLE_USERS}.id`
      )
      .where({ [`${this.TABLE_POSTS}.id`]: id });

    return result as PostDBWithCreatorName | undefined;
  };

  public findLikeDislike = async (
    likeDislikeDB: likeDislikeDB
  ): Promise<POST_LIKE | undefined> => {
    const [result] = await BaseDatabase.connection(this.TABLE_LIKES_DISLIKES)
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });

    if( result === undefined ) {
        return undefined;
    } else if(result.like === 1){
        return POST_LIKE.ALREADY_LIKED
    } else {
        return POST_LIKE.ALREADY_DISLIKED
    }
  };

  public removeLikeDislike = async (
    likeDislikeDB: likeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_LIKES_DISLIKES).delete().where({
      user_id: likeDislikeDB.user_id,
      post_id: likeDislikeDB.post_id,
    });
  };

  public updateLikeDislike = async (
    likeDislikeDB: likeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_LIKES_DISLIKES)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };
  public insertLikeDislike = async (
    likeDislikeDB: likeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_LIKES_DISLIKES).insert(
      likeDislikeDB
    );
  };
}
