import {Router} from "express"
import { createCommentController, createPostController, getCommentController, getPostsController , likeDislikeCommentController, likeDislikePostController , } from "../../../controller/postController.js"

const router = Router()

router.get("/", getPostsController)

router.get("/post", getPostsController)
router.post("/post",createPostController)
router.post("/like-post", likeDislikePostController)
router.post("/comment",createCommentController)
router.get("/comments", getCommentController)
router.post("/like-comment",likeDislikeCommentController)



export default router