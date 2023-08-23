import { Request, Response } from "express";
import { ZodError } from "zod";
import { CreateCommentSchema } from "../dtos/commentDTO/createComment.dto";
import { BaseError } from "../error/BaseError";
import { CommentBusiness } from "../business/CommentBusiness";
import { GetCommentSchema } from "../dtos/commentDTO/getComment.dto";
import { LikeOrDislikeSchema } from "../dtos/commentDTO/likeOrDislikeComment.dto";

export class CommentController {
  constructor(private commentBusiness: CommentBusiness) {}

  public createComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = CreateCommentSchema.parse({
        postId: req.params.postId,
        content: req.body.content,
        token: req.headers.authorization,
      });

      const output = await this.commentBusiness.createComment(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public getComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = GetCommentSchema.parse({
        token: req.headers.authorization,
        postId: req.params.postId,
      });

      const output = await this.commentBusiness.getComments(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public likeOrDislikeComment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const input = LikeOrDislikeSchema.parse({
        commentId: req.params.id,
        token: req.headers.authorization,
        like: req.body.like,
      });

      const output = await this.commentBusiness.likeOrDislikeComment(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
