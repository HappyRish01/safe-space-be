import { Router } from "express";
import {
  createCommentController,
  createPostController,
  getCommentController,
  getPostsController,
  likeDislikeCommentController,
  likeDislikePostController,
} from "../../../controller/postController.js";

const router = Router();

router.post("/create", createPostController);
router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await prisma.post.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong in deleting post" });
  }
});

router.get("/posts", getPostsController);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
            select: {
              username: true,
              profileImage: true,  
            },
            
        },
        comments: {
          include: {
            user: {
              select:{
                username: true,
                profileImage: true,
              }
            },
          }
        },
  }});
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    } 
    const like = await prisma.postLike.findFirst({
        where: {
          postId: id,
          userId: userId,
        },
      });
      const isLiked = !!like;

    return res.status(200).json({ ...post, isLiked });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong ing" });
  }
});


router.post("/like-post", likeDislikePostController);

router.post("/comment", createCommentController);

router.post("/comments", getCommentController);

router.post("/like-comment", likeDislikeCommentController);

export default router;