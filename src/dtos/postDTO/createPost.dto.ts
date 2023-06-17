import z from "zod";

export interface CreatePostInputDTO {
  content: string;
  token: string;
}

export type CreatePostOutputDTO = undefined;

export const CreatePostSchema = z
  .object({
    content: z
      .string({
        required_error: "'Mensagem' é obrigatório",
        invalid_type_error: "'mensagem' deve ser do tipo string",
      })
      .min(1),
    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as CreatePostInputDTO);
