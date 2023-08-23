import { BaseDatabase } from "../../src/database/BaseDatabase";
import {
  PostDBWithCreatorName,
  PostDB,
  likeDislikePostDB,
  POST_LIKE,
} from "../../src/models/Post";

const postMock: PostDB[] = [
  {
    id: "p001",
    creator_id: "u001",
    content: "Boa tarde!",
    likes: 0,
    dislikes: 0,
    comment_count: 0,
  },
  {
    id: "p002",
    creator_id: "u002",
    content: "Que qui foi, que qui foi, que qui há?!",
    likes: 0,
    dislikes: 0,
    comment_count: 0,
  },
];

const postWithCreatorNameMock: PostDBWithCreatorName[] = [
  {
    id: "p003",
    creator_id: "u003",
    content: "Olá! Espero ter ajudado.",
    likes: 5,
    dislikes: 1,
    comment_count: 0,
    creator_name: "Melani",
  },
  {
    id: "p004",
    creator_id: "u004",
    content: "Olá! Tudo bem?",
    likes: 4,
    dislikes: 6,
    comment_count: 0,
    creator_name: "Jefferson",
  },
];

export class PostDatabaseMock extends BaseDatabase {
  public getPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    return postWithCreatorNameMock;
  };

  public findById = async (id: string): Promise<PostDB | undefined> => {
    return postMock.filter((post) => post.id === id)[0];
  };

  public insertPost = async (postDB: PostDB): Promise<void> => {};

  public updatePost = async (postDB: PostDB): Promise<void> => {};

  public deletePost = async (id: string): Promise<void> => {};

  public findPostWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorName | undefined> => {
    return postWithCreatorNameMock.filter((post) => post.id === id)[0];
  };

  public findLikeDislike = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<POST_LIKE | undefined> => {
    return undefined;
  };

  public removeLikeDislike = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {};

  public updateLikeDislike = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {};
  public insertLikeDislike = async (
    likeDislikeDB: likeDislikePostDB
  ): Promise<void> => {};
}
