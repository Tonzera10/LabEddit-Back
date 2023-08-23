import { TokenPayload } from "../../src/models/User";

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "id-mock") {
      // signup de nova conta
      return "token-mock";
    } else if (payload.id === "id-mock-ton") {
      // login de ton (conta admin)
      return "token-mock-ton";
    } else {
      // login de jeff (conta normal)
      return "token-mock-jeff";
    }
  };

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-ton") {
      return {
        id: "id-mock-ton",
        name: "tonzera",
      };
    } else if (token === "token-mock-jeff") {
      return {
        id: "id-mock-jeff",
        name: "jeff",
      };
    } else {
      return null;
    }
  };
}
