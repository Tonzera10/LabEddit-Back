import z from "zod";
import { CommentModel } from "../../models/Comment";

export interface GetCommentInputDTO {
  token: string;
  postId: string;
}

export type GetCommentOutputDTO = CommentModel[];

export const GetCommentSchema = z
  .object({
    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
    postId: z
      .string({
        required_error: "'post_id' é obrigatório",
        invalid_type_error: "'post_id' deve ser do tipo string",
      })
      .min(1),
  })
  .transform((data) => data as GetCommentInputDTO);
