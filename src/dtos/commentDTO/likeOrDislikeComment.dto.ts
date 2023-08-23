import z from "zod";

export interface likeOrDislikeCommentInputDTO {
  commentId: string;
  token: string;
  like: boolean;
}

export type likeOrDislikeCommentOutputDTO = undefined;

export const LikeOrDislikeSchema = z
  .object({
    commentId: z.string({
      required_error: "'id' é obrigatório",
      invalid_type_error: "'id' deve ser do tipo string",
    }),
    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
    like: z.boolean(),
  })
  .transform((data) => data as likeOrDislikeCommentInputDTO);
