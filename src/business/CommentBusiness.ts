import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dtos/commentDTO/createComment.dto";
import {
  GetCommentInputDTO,
  GetCommentOutputDTO,
} from "../dtos/commentDTO/getComment.dto";
import {
  likeOrDislikeCommentInputDTO,
  likeOrDislikeCommentOutputDTO,
} from "../dtos/commentDTO/likeOrDislikeComment.dto";
import { NotFoundError } from "../error/NotFoundError";
import { UnauthorizedError } from "../error/UnauthorizedError";
import {
  COMMENT_LIKE,
  Comment,
  CommentModel,
  likeDislikeCommentDB,
} from "../models/Comment";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private postDatabase: PostDatabase,
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    const { postId, content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const idPostExist = await this.commentDatabase.findByIdPost(postId);

    if (!idPostExist) {
      throw new NotFoundError("IdPost não existe");
    }

    const id = this.idGenerator.generate();

    const comment = new Comment(
      id,
      postId,
      content,
      0,
      0,
      payload.id,
      payload.name
    );

    await this.commentDatabase.createComment(comment.toDBModel());

    const creatorDB = await this.userDatabase.findById(idPostExist.creator_id);

    const post = new Post(
      idPostExist.id,
      idPostExist.content,
      idPostExist.likes,
      idPostExist.dislikes,
      idPostExist.comment_count,
      idPostExist.creator_id,
      creatorDB.name
    );

    post.increaseComments();
    await this.postDatabase.updatePost(post.toDBModel());

    const output: CreateCommentOutputDTO = {
      message: "Comentário criado com successo!",
    };

    return output;
  };

  public getComments = async (
    input: GetCommentInputDTO
  ): Promise<GetCommentOutputDTO> => {
    const { token, postId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentsModel: CommentModel[] = [];

    const commentDBWithCreatorName =
      await this.commentDatabase.getCommentWithCreatorName();

    commentDBWithCreatorName.map((commentWithCreatorName) => {
      const comment = new Comment(
        commentWithCreatorName.id,
        commentWithCreatorName.post_id,
        commentWithCreatorName.content,
        commentWithCreatorName.likes,
        commentWithCreatorName.dislikes,
        commentWithCreatorName.creator_id,
        commentWithCreatorName.creator_name
      );

      return commentsModel.push(comment.toBusinessModel());
    });

    const output: GetCommentOutputDTO = commentsModel;

    return output;
  };

  public likeOrDislikeComment = async (
    input: likeOrDislikeCommentInputDTO
  ): Promise<likeOrDislikeCommentOutputDTO> => {
    const { commentId, token, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("token inválido");
    }

    const commentDBWithCreatorName =
      await this.commentDatabase.findCommentWithCreatorNameById(commentId);

    if (!commentDBWithCreatorName) {
      throw new NotFoundError("comentário não encontrado!");
    }

    const comment = new Comment(
      commentDBWithCreatorName.id,
      commentDBWithCreatorName.post_id,
      commentDBWithCreatorName.content,
      commentDBWithCreatorName.likes,
      commentDBWithCreatorName.dislikes,
      commentDBWithCreatorName.creator_id,
      commentDBWithCreatorName.creator_name
    );

    const likeSQlite = like ? 1 : 0;

    const likeDislikeDB: likeDislikeCommentDB = {
      user_id: payload.id,
      comment_id: commentId,
      like: likeSQlite,
    };

    const likeDislikeExists = await this.commentDatabase.findLikeDislike(
      likeDislikeDB
    );

    if (likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB);
        comment.removeLike();
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB);
        comment.removeLike();
        comment.addDislike();
      }
    } else if (likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB);
        comment.removeDislike();
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB);
        comment.removeDislike();
        comment.addLike();
      }
    } else {
      await this.commentDatabase.insertLikeDislike(likeDislikeDB);
      if (like) {
        comment.addLike();
      } else {
        comment.addDislike();
      }
    }

    const updatedCommentDB = comment.toDBModel();
    await this.commentDatabase.updateComment(updatedCommentDB);

    const output: likeOrDislikeCommentOutputDTO = undefined;

    return output;
  };
}
