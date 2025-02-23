import { Router } from "express";

const router = Router();

//Get all communities
router.get("/communities", async (req, res) => {
  try {
    const communities = await prisma.community.findMany();
    res.json(communities);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get all posts of a community
router.get("/:id/posts", async (req, res) => {
  const { id } = req.params;
  const {skip=0,take=15} = req.query;

  const userId = req.user?.id;
  try {
    const posts = await prisma.post.findMany({
        skip,
        take,
      where: {
        communityId: id,
      },
      include: {
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
        likes: {
          where: {
            userId,
          },
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Sorting baby 
      },
    });
    if (!posts) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json( posts.map((post) => {
        const { likes, ...rest } = post; // Destructure `likes` and keep the rest of the post data
        return {
          ...rest,
          isLiked: likes.length > 0, // Add `isLiked` flag
        };
    }));

    //   res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/post",async(req,res) => {
    const userId = req.user.id;
    const {communityId,content ,caption} = req.body;

    try {
        const post = await prisma.post.create({
            data: {
                content,
                caption,
                userId,
                communityId,
            }
        })

        res.status(200).json({
            message: "Post created successfully",
            post,
            
        })
    }catch(e){
        return res.status(500).json({
            message: "Failed to create post"
        })
    }

})



export default router;
