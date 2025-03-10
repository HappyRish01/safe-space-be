import { Router } from "express";
import {
  createCommentController,
  createPostController,
  getCommentController,
  getPostsController,
  likeDislikeCommentController,
  likeDislikePostController,
} from "../../../controller/postController.js";

import { getComments } from "../../../services/postService.js";

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
    return res
      .status(500)
      .json({ error: "Something went wrong in deleting post" });
  }
});

router.get("/posts", getPostsController);
router.get("/user" , async (req,res) => {
    const userId = req.user.id
    try{
        const user = await prisma.user.findUnique({
            where: {
                id:userId
            },
            select: {
                id: true,
                username: true,
                profileImage: true
                
            }
        })
        return res.status(200).json(user)

    }
    catch(e){
        return res.status(500).json({
            message: "Failed to get user details"
        })
    }
})


router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comments = await getComments(userId,postId);

    const like = await prisma.postLike.findFirst({
      where: {
        postId,
        userId
      },
    });
    const isLiked = !!like;

    return res.status(200).json({ ...post, isLiked , comments });
  } catch (error) {
    return res.status(500).json({ erro: "Something went wrong ing" , error , e : error.message });
  }
});

router.post("/like-post", likeDislikePostController);

router.post("/comment", createCommentController);

router.post("/comments", getCommentController);

router.post("/like-comment", likeDislikeCommentController);

router.post("/whisper" , async (req,res) => {
  //from id
  const userId = req.user.id;
  const {toId,comment,postId} = req.body;
  if(!toId || !comment){
    return res.status(400).json({
      message: "Missing fields"
    })
  }
  try{
    console.log(userId,"u",toId,"t",comment,"c",postId,"p")

    const whishper = await prisma.whishper.create({
      data: {
        fromId: userId,
        toId,
        comment,
        postId
      }
    })

   
    
    return res.status(200).json(whishper)
  }
  catch(e){
    return res.status(500).json({
      message: "Failed to create whishper",
      e: e.message,
      error: e
    })
  }
})

export default router;
