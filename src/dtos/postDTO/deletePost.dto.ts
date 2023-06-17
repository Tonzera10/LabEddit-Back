import z from "zod";

export interface DeletePostInputDTO {
  idToDelete: string;
  token: string;
}

export type DeletePostOutputDTO = undefined;

export const DeletePostSchema = z
  .object({
    idToDelete: z.string({
      required_error: "'id' é obrigatório",
      invalid_type_error: "'id' deve ser do tipo string",
    }),
    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as DeletePostInputDTO);
