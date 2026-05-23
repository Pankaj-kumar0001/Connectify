import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

  content: {
    type: String,
    required: true,
    trim: true,
  },

  image: {
    type: String,
    default: "",
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      text: {
        type: String,
      }
    }
  ]

}, {
  timestamps: true,
});

const Post = mongoose.model("Post", postSchema);

export default Post;