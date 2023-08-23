import { UserBusiness } from "../../../src/business/UserBusiness";
import { LoginSchema } from "../../../src/dtos/userDTO/Login.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManangerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve gerar token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "everton@email.com",
      password: "ton123",
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({
      message: "Login executado com sucesso!",
      token: "token-mock-ton",
    });
  });
});
