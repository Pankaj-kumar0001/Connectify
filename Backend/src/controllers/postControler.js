import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {

  try {

    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const post = await Post.findOne({
      content,
    });

    if (post) {
      return res.status(409).json({
        message: "Same content already exists",
      });
    }

    const newPost = await Post.create({
      content,
      image,
      author: req.user.id,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }

};

export const feed = async (req, res) => {

  try {

    const posts = await Post.find()
      .populate("author", "name username profilePic")
      .populate("comments.user", "name username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All posts fetched successfully",
      posts,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }

};

export const likePost = async (req, res) => {

  try {

    const id = req.user.id;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isLiked = post.likes.some(
      (userId) => userId.toString() === id
    );

    if (isLiked) {

      post.likes = post.likes.filter(
        (userId) => userId.toString() !== id
      );

      await post.save();

      return res.status(200).json({
        message: "Post unliked",
      });

    } else {

      post.likes.push(id);

      await post.save();

      return res.status(200).json({
        message: "Post liked",
      });

    }

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }

};


export  const addComment = async(req,res)=>{
try{
    const { text } = req.body;
    const id= req.params.id;

    const post = await Post.findById(id);

    if(!post){
        return res.status(409).json({
            message:"No Post find"
        })
    }

      post.comments.push({
      user: req.user.id,
      text,
    });
    await post.save();

    res.status(201).json({
        message:"Comment Added"
    })
}catch(error){
    return res.status(500).json({
        message:error.message,
    });
}

}

export const followUnfollow = async (req, res) => {

  try {

    const currentUserId = req.user.id;

    const targetUserId = req.params.id;

    // prevent self follow
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    // find users
    const currentUser = await User.findById(currentUserId);

    const targetUser = await User.findById(targetUserId);

    // validation
    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // check already following
    const isFollowing = currentUser.following.includes(targetUserId);

    // unfollow
    if (isFollowing) {

      currentUser.following.pull(targetUserId);

      targetUser.followers.pull(currentUserId);

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        message: "User unfollowed successfully",
      });

    }

    // follow
    currentUser.following.push(targetUserId);

    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      message: "User followed successfully",
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }

};

export const deletePost = async (req, res) => {

  try {

    const id = req.params.id;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "No post found"
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "User is not authorized"
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      message: "Post deleted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

};

export const updatePost = async (req, res) => {

  try {

    const { content, image } = req.body;

    const post = await Post.findById(req.params.id);

    // check post exists
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // authorization check
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "User is not authorized to update this post",
      });
    }

    // partial updates
    post.content = content || post.content;

    post.image = image || post.image;

    // save updated post
    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }

};