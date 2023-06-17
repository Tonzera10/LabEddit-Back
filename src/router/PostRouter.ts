import express from "express";
import { PostDatabase } from "../database/PostDatabase";
import { PostBusiness } from "../business/PostBusiness";
import { PostController } from "../controller/PostController";
import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../database/UserDatabase";
import { TokenManager } from "../services/TokenManager";
import { HashManager } from "../services/HashManager";

export const postRouter = express.Router();

const postController = new PostController(
  new PostBusiness(new PostDatabase(), new IdGenerator(), new TokenManager())
);

postRouter.post("/", postController.createPost);
postRouter.get("/", postController.getPosts);
postRouter.put("/:id", postController.editPost);
postRouter.delete("/:id", postController.deletePost);
postRouter.put("/:id/like", postController.likeOrDislikePost);
