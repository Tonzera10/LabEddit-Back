import { PostBusiness } from "../../../src/business/PostBusiness";
import { GetPostSchema } from "../../../src/dtos/postDTO/getPost.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManangerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("testando getPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar mensagem de sucesso", async () => {
    const input = GetPostSchema.parse({
      token: "token-mock-ton",
    });

    const output = await postBusiness.getPosts(input);

    expect(output).toEqual({
      message: "Post criado com sucesso!",
    });
  });
});
