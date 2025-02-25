import { prisma } from "../libs/prisma.js";

export async function createPost(userId, content, caption, communityId) {
  return await prisma.post.create({
    data: {
      content,
      userId,
      caption,
      communityId,
    },
    // include: {
    //   user: true  if u ever need user details at the time of creation lakshay
    // }
  });
}

export async function getPosts(userId, skip = 0, take = 15) {
  const posts = await prisma.post.findMany({
    skip,
    take,
    include: {
      user: {
        select: {
          profileImage: true,
          username: true,
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
      comments: {
        include: {
          user: true,
          likes: true,
        },
      },
      community: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Sorting baby
    },
  });
  return posts.map((post) => {
    const { likes, ...rest } = post; // Destructure `likes` and keep the rest of the post data
    return {
      ...rest,
      isLiked: likes.length > 0, // Add `isLiked` flag
    };
  });
}

export async function likeDislikePost(userId, postId) {
  const like = await prisma.postLike.findFirst({
    where: {
      userId,
      postId,
    },
  });

  if (like) {
    await prisma.postLike.delete({
      where: {
        id: like.id,
      },
    });

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likesCount: {
          decrement: 1,
        },
      },
    });

    return {
      isLiked: false,
    };
  }

  await prisma.postLike.create({
    data: {
      userId,
      postId,
    },
  });

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      likesCount: {
        increment: 1,
      },
    },
  });

  return {
    isLiked: true,
  };
}

export async function createComment(userId, postId, content) {
  
  const comment =  await prisma.comment.create({
    data: {
      userId,
      postId,
      comment: content,
    },
    include: {
      user: {
        select: {
          profileImage: true,
          username: true,
        },
      },
    },
  });
  try{

    
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });
  }
  catch(e){
    console.log(e)
  }
  return comment
}

export async function getComments(userId, postId, skip = 0, take = 5) {
  const comments = await prisma.comment.findMany({
    skip,
    take,
    where: {
      postId,
    },
    include: {
      user: true,
      likes: {
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      },
    },
  });

  return comments.map((comment) => ({
    ...comment,
    isLiked: comment.likes.length > 0,
  }));
}

export async function likeDislikeComment(userId, commentId) {
  const like = await prisma.commentLike.findFirst({
    where: {
      userId,
      commentId,
    },
  });

  if (like) {
    await prisma.commentLike.delete({
      where: {
        id: like.id,
      },
    });

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likesCount: {
          decrement: 1,
        },
      },
    });

    return {
      isLiked: false,
    };
  }

  await prisma.commentLike.create({
    data: {
      userId,
      commentId,
    },
  });

  await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      likesCount: {
        increment: 1,
      },
    },
  });

  return {
    isLiked: true,
  };
}
