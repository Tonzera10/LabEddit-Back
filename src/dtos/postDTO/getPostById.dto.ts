import z from "zod";
import { PostModel } from "../../models/Post";

export interface GetPostByIdInputDTO {
  token: string;
  postId: string;
}

export type GetPostByIdOutputDTO = PostModel;

export const GetPostByIdSchema = z
  .object({
    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
    postId: z.string({
      required_error: "'id' é obrigatório",
      invalid_type_error: "'id' deve ser do tipo string",
    }),
  })
  .transform((data) => data as GetPostByIdInputDTO);
