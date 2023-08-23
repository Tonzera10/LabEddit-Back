import {
  COMMENT_LIKE,
  CommentDB,
  CommentDBWithCreatorName,
  likeDislikeCommentDB,
} from "../models/Comment";
import { PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";
  public static TABLE_POSTS = "posts";
  public static TABLE_COMMENTS = "comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";

  public createComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).insert(
      commentDB
    );
  };

  public findByIdPost = async (
    post_id: string
  ): Promise<PostDB | undefined> => {
    const [postDB] = await BaseDatabase.connection(
      CommentDatabase.TABLE_POSTS
    ).where({
      id: post_id,
    });
    return postDB;
  };

  public getCommentWithCreatorName = async (): Promise<
    CommentDBWithCreatorName[]
  > => {
    const result = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.id`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        `${CommentDatabase.TABLE_COMMENTS}.content`,
        `${CommentDatabase.TABLE_COMMENTS}.likes`,
        `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentDatabase.TABLE_USERS}.name as creator_name`
      )
      .leftJoin(
        `${CommentDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        "=",
        `${CommentDatabase.TABLE_USERS}.id`
      )
      .leftJoin(
        `${CommentDatabase.TABLE_POSTS}`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        "=",
        `${CommentDatabase.TABLE_POSTS}.id`
      );

    return result as CommentDBWithCreatorName[];
  };

  public updateComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .update(commentDB)
      .where({ id: commentDB.id });
  };

  public findCommentWithCreatorNameById = async (
    id: string
  ): Promise<CommentDBWithCreatorName | undefined> => {
    const [result] = await BaseDatabase.connection(
      CommentDatabase.TABLE_COMMENTS
    )
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.id`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        `${CommentDatabase.TABLE_COMMENTS}.content`,
        `${CommentDatabase.TABLE_COMMENTS}.likes`,
        `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentDatabase.TABLE_USERS}.name as creator_name`
      )
      .leftJoin(
        `${CommentDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        "=",
        `${CommentDatabase.TABLE_USERS}.id`
      )
      .leftJoin(
        `${CommentDatabase.TABLE_POSTS}`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        "=",
        `${CommentDatabase.TABLE_POSTS}.id`
      )
      .where({ [`${CommentDatabase.TABLE_COMMENTS}.id`]: id });

    return result as CommentDBWithCreatorName | undefined;
  };

  public findLikeDislike = async (
    likeDislikeDB: likeDislikeCommentDB
  ): Promise<COMMENT_LIKE | undefined> => {
    const [result] = await BaseDatabase.connection(
      CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS
    )
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id,
      });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return COMMENT_LIKE.ALREADY_LIKED;
    } else {
      return COMMENT_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeDislike = async (
    likeDislikeDB: likeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id,
      });
  };

  public updateLikeDislike = async (
    likeDislikeDB: likeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id,
      });
  };
  public insertLikeDislike = async (
    likeDislikeDB: likeDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(
      CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS
    ).insert(likeDislikeDB);
  };
}
