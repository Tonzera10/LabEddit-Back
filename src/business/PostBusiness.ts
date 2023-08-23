import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/postDTO/createPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../dtos/postDTO/getPost.dto";
import {
  GetPostByIdInputDTO,
  GetPostByIdOutputDTO,
} from "../dtos/postDTO/getPostById.dto";
import {
  likeOrDislikeInputDTO,
  likeOrDislikeOutputDTO,
} from "../dtos/postDTO/likeOrDislikePost.dto";
import { NotFoundError } from "../error/NotFoundError";
import { UnauthorizedError } from "../error/UnauthorizedError";
import { POST_LIKE, Post, likeDislikePostDB } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const id = this.idGenerator.generate();

    const post = new Post(id, content, 0, 0, 0, payload.id, payload.name);

    const postDB = post.toDBModel();
    await this.postDatabase.insertPost(postDB);

    const output: CreatePostOutputDTO = {
      message: "Post criado com sucesso!",
    };

    return output;
  };

  public getPosts = async (
    input: GetPostInputDTO
  ): Promise<GetPostOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("token inválido");
    }

    const postDBWithCreatorName =
      await this.postDatabase.getPostsWithCreatorName();

    const posts = postDBWithCreatorName.map((postWithCreatorName) => {
      const post = new Post(
        postWithCreatorName.id,
        postWithCreatorName.content,
        postWithCreatorName.likes,
        postWithCreatorName.dislikes,
        postWithCreatorName.comment_count,
        postWithCreatorName.creator_id,
        postWithCreatorName.creator_name
      );

      return post.toBusinessModel();
    });

    const output: GetPostOutputDTO = posts;

    return output;
  };

  public getPostById = async (
    input: GetPostByIdInputDTO
  ): Promise<GetPostByIdOutputDTO> => {
    const { token, postId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("token inválido");
    }

    const postDB = await this.postDatabase.findById(postId);

    if (!postDB) {
      throw new NotFoundError("Id não encontrado");
    }

    const userDB = await this.userDatabase.findById(postDB.creator_id);

    const post = new Post(
      postDB.id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.comment_count,
      postDB.creator_id,
      userDB.name
    );

    const output: GetPostByIdOutputDTO = post.toBusinessModel();
    return output;
  };

  public likeOrDislikePost = async (
    input: likeOrDislikeInputDTO
  ): Promise<likeOrDislikeOutputDTO> => {
    const { postId, token, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("token inválido");
    }

    const postDBWithCreatorName =
      await this.postDatabase.findPostWithCreatorNameById(postId);

    if (!postDBWithCreatorName) {
      throw new NotFoundError("post não encontrado!");
    }

    const post = new Post(
      postDBWithCreatorName.id,
      postDBWithCreatorName.content,
      postDBWithCreatorName.likes,
      postDBWithCreatorName.dislikes,
      postDBWithCreatorName.comment_count,
      postDBWithCreatorName.creator_id,
      postDBWithCreatorName.creator_name
    );

    const likeSQlite = like ? 1 : 0;

    const likeDislikeDB: likeDislikePostDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeSQlite,
    };

    const likeDislikeExists = await this.postDatabase.findLikeDislike(
      likeDislikeDB
    );

    if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.removeLikeDislike(likeDislikeDB);
        post.removeLike();
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDatabase.removeLikeDislike(likeDislikeDB);
        post.removeDislike();
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB);
        post.removeDislike();
        post.addLike();
      }
    } else {
      await this.postDatabase.insertLikeDislike(likeDislikeDB);
      if (like) {
        post.addLike();
      } else {
        post.addDislike();
      }
    }

    const updatedPostDB = post.toDBModel();
    await this.postDatabase.updatePost(updatedPostDB);

    const output: likeOrDislikeOutputDTO = undefined;

    return output;
  };
}
