import express from "express";
import { UserDatabase } from "../database/UserDatabase";
import { UserBusiness } from "../business/UserBusiness";
import { UserController } from "../controller/UserController";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { HashManager } from "../services/HashManager";

export const userRouter = express.Router();

const userController = new UserController(
  new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()
  )
);

userRouter.post("/signup", userController.singup);
userRouter.post("/login", userController.login);
