import z from "zod";

export interface CreateCommentInputDTO {
  postId: string;
  content: string;
  token: string;
}

export type CreateCommentOutputDTO = {
  message: string;
};

export const CreateCommentSchema = z
  .object({
    postId: z
      .string({
        required_error: "'post_id' é obrigatório",
        invalid_type_error: "'post_id' deve ser do tipo string",
      })
      .min(1),
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
  .transform((data) => data as CreateCommentInputDTO);
