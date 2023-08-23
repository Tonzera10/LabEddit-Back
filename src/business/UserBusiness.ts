import { UserDatabase } from "../database/UserDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/userDTO/Login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/userDTO/Signup.dto";
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";
import { TokenPayload, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashMananger: HashManager
  ) {}

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;

    const id = this.idGenerator.generate();

    const hashedPassword = await this.hashMananger.hash(password);

    const user = new User(id, name, email, hashedPassword);

    const userDB = user.toDBModel();
    await this.userDatabase.insertUser(userDB);

    const tokenPayload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
    };

    const token = this.tokenManager.createToken(tokenPayload);

    const output: SignupOutputDTO = {
      message: "Usuário criado com sucesso!",
      token,
    };

    return output;
  };

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const userDB = await this.userDatabase.findByEmail(email);
    if (!userDB) {
      throw new NotFoundError("Email não encontrado!");
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password
    );

    const hashedPassword = user.getPassword();
    const isPasswordCorrect = await this.hashMananger.compare(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("e-mail e/ou senha invalido(s)");
    }

    const tokenPayload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
    };
    const token = this.tokenManager.createToken(tokenPayload);

    const output: LoginOutputDTO = {
      message: "Login executado com sucesso!",
      token,
    };

    return output;
  };
}
