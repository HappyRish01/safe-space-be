import {
  createComment,
  createPost,
  getComments,
  getPosts,
  likeDislikeComment,
  likeDislikePost,
} from "../services/postService.js";

export async function createPostController(req, res) {
  const { communityId, content, caption } = req.body;
  const userId = req.user.id;
  	if (caption){
  try {
        const response= await fetch('https://dd42-2401-4900-4121-247c-c417-e731-308f-7b31.ngrok-free.app/api/v1/toxicity', {
          method:"POST",
          headers:{
            "Content-Type": "application/json",
          },
          body:JSON.stringify({

            msg:caption,

          })});
        const data=await response.json();

        if (response.ok){

  	if (data.toxicity ){
      if(caption.includes("very")){
        let newToxicity;
        newToxicity = data.toxicity + 0.04 <= 1 ?  data.toxicity + 0.04 : 1;
        return res.status(500).json({
              message: `Please use Kinder Words. your post is ${Math.floor(newToxicity*100)}% TOXIC `
          })
      }
  	return res.status(500).json({
              message: `Please use Kinder Words. your post is ${Math.floor(data.toxicity*100)}% TOXIC `
          })

  	}
        }else{
          throw new Error('some Error Occured');
        }

      } catch (e) {
  	return res.status(500).json({
              message: "some Error Occurred"
          })

      }
  }

  try {

    const post = await createPost(userId, content, caption, communityId);
    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to create post",
    });
  }
}

export async function getPostsController(req, res) {
  const userId = req.user.id;
  let { skip, take } = req.query;
  skip = parseInt(skip) || 0;
  take = parseInt(take) || 15;
  try {
    const posts = await getPosts(userId, skip, take);
    return res.status(200).json({
      posts,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to fetch posts why i dont know",
      err: e,
      error: e.message,
    });
  }
}

export async function likeDislikePostController(req, res) {
  const userId = req.user.id;
  const { postId } = req.body;

  try {
    const like = await likeDislikePost(userId, postId);

    return res.status(200).json(like);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Like failed try again later",
    });
  }
}

export async function createCommentController(req, res) {
  const { content, postId } = req.body;
  const userId = req.user.id;
  if (content){
    try {
          const response= await fetch('https://dd42-2401-4900-4121-247c-c417-e731-308f-7b31.ngrok-free.app/api/v1/toxicity', {
            method:"POST",
            headers:{
              "Content-Type": "application/json",
            },
            body:JSON.stringify({
  
              msg:content,
  
            })});
          const data=await response.json();
  
          if (response.ok){
  
      if (data.toxicity){
        if(caption.includes("very")){
          let newToxicity;
          newToxicity = data.toxicity + 0.04 <= 1 ?  data.toxicity + 0.04 : 1;
          return res.status(500).json({
                message: `Please use Kinder Words. your post is ${Math.floor(newToxicity*100)}% TOXIC `
            })
        }
      return res.status(500).json({
                message: `Please use Kinder Words. your comment is ${Math.floor(data.toxicity*100)}% TOXIC `
            })
  
      }
          }else{
            throw new Error('some Error Occured');
          }
  
        } catch (e) {
      return res.status(500).json({
                message: "some Error Occurred"
            })
  
        }
    }
  try {
    const comment = await createComment(userId, postId, content);
    res.status(200).json({
      comment,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Not been able to comment sir",
    });
  }
}

export async function getCommentController(req, res) {
  const userId = req.user.id;
  const { postId, skip, take } = req.body;

  try {
    const comments = await getComments(userId, postId, skip, take);
    res.status(200).json({
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch comments",
    });
  }
}

export async function likeDislikeCommentController(req, res) {
  const userId = req.user.id;
  const { commentId } = req.body;

  try {
    const like = await likeDislikeComment(userId, commentId);
    res.status(200).json(like);
  } catch (error) {
    res.status(500).json({
      message: "Liked failed very badly please try again",
    });
  }
}
