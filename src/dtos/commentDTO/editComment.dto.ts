import z from "zod";

export interface EditCommentInputDTO {
  idToEdit: string;
  content: string;
  token: string;
}

export type EditCommentOutputDTO = undefined;

export const EditPostSchema = z
  .object({
    idToEdit: z.string({
      required_error: "'id' é obrigatório",
      invalid_type_error: "'id' deve ser do tipo string",
    }),
    content: z
      .string({
        required_error: "'comentário' é obrigatório",
        invalid_type_error: "'comentário' deve ser do tipo string",
      })
      .min(1, "'comentário' deve possuir no mínimo 1 caractere"),
    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as EditCommentInputDTO);
