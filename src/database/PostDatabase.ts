import {
  POST_LIKE,
  PostDB,
  PostDBWithCreatorName,
  likeDislikePostDB,
} from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_USERS = "users";
  public static TABLE_LIKES_DISLIKES_POST = "likes_dislikes_posts";

  public getPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const result = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.comment_count`,
        `${PostDatabase.TABLE_USERS}.name as creator_name`
      )
      .leftJoin(
        `${PostDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${PostDatabase.TABLE_USERS}.id`
      );

    return result as PostDBWithCreatorName[];
  };

  public findById = async (id: string): Promise<PostDB | undefined> => {
    const [postDB] = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    ).where({
      id,
    });
    return postDB;
  };

  public insertPost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(postDB);
  };

  public updatePost = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(postDB)
      .where({ id: postDB.id });
  };

  public deletePost = async (id: string): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .delete()
      .where({ id });
  };

  public findPostWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.comment_count`,
        `${PostDatabase.TABLE_USERS}.name as creator_name`
      )
      .innerJoin(
        `${PostDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${PostDatabase.TABLE_USERS}.id`
      )
      .where({ [`${PostDatabase.TABLE_POSTS}.id`]: id });

    return result as PostDBWithCreatorName | undefined;
  };

  public findLikeDislike = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<POST_LIKE | undefined> => {
    const [result] = await BaseDatabase.connection(
      PostDatabase.TABLE_LIKES_DISLIKES_POST
    )
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED;
    } else {
      return POST_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeDislike = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };

  public updateLikeDislike = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id,
      });
  };
  public insertLikeDislike = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {
    await BaseDatabase.connection(
      PostDatabase.TABLE_LIKES_DISLIKES_POST
    ).insert(likeDislikeDB);
  };
}
