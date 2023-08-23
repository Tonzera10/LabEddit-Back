import express from "express";
import { PostDatabase } from "../database/PostDatabase";
import { PostBusiness } from "../business/PostBusiness";
import { PostController } from "../controller/PostController";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { UserDatabase } from "../database/UserDatabase";

export const postRouter = express.Router();

const postController = new PostController(
  new PostBusiness(
    new PostDatabase(),
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
);

postRouter.post("/", postController.createPost);
postRouter.get("/", postController.getPosts);
postRouter.get("/:id", postController.getPostById);
postRouter.put("/:id/like", postController.likeOrDislikePost);
