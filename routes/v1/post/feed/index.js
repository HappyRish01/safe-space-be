import { Router } from "express";


const router = Router()

router.get("/" ,async (req,res)=>{
        const {skip,take} = req.body;
        try {
            const posts = await getUnprotectedPost(skip,take)
            return res.status(200).json({
                posts
            })
        }catch(e){
            return res.status(500).json({
                message: "Failed to fetch posts why i dont know",
                e
            })
        }
    }
    
)

async function getUnprotectedPost (skip=0,take=15) {
  const posts =  await prisma.post.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            profileImage: true,
            username: true
          }
        }
      },  
      orderBy: {
        createdAt: 'desc', // Sorting baby 
      },
    });
    return posts.map((post) => ({
      ...post,
      isLiked: false,
    }))
}
export default router
