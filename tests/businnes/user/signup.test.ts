import { UserBusiness } from "../../../src/business/UserBusiness";
import { SignupSchema } from "../../../src/dtos/userDTO/Signup.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManangerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("testando signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve gerar token ao cadastrar", async () => {
    const input = SignupSchema.parse({
      name: "Ciclana",
      email: "ciclana@email.com",
      password: "ciclana321",
    });

    const output = await userBusiness.signup(input);

    expect(output).toEqual({
      message: "Usuário criado com sucesso!",
      token: "token-mock",
    });
  });
});
