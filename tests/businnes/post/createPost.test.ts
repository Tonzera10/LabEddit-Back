import { PostBusiness } from "../../../src/business/PostBusiness";
import { CreatePostSchema } from "../../../src/dtos/postDTO/createPost.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManangerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("testando createPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar mensagem de sucesso", async () => {
    const input = CreatePostSchema.parse({
      content: "fala galerinha",
      token: "token-mock-ton",
    });

    const output = await postBusiness.createPost(input);

    expect(output).toEqual({
      message: "Post criado com sucesso!",
    });
  });
});
