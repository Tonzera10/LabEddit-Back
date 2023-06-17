import z from "zod";
import { PostModel } from "../../models/Post";

export interface GetPostInputDTO {
  token: string;
}

export type GetPostOutputDTO = PostModel[];

export const GetPostSchema = z
  .object({
    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as GetPostInputDTO);
