import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required!" });

    //image upload and we will optimise it using sharp module to make image more web friendly
    const optimizedImagebuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    //buffer to dataUri
    const fileUri = `data:image/jpeg;base64,${optimizedImagebuffer.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    if (!cloudResponse || !cloudResponse.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added!",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username,profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKarneWaleUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });

    //Main like logic
    await post.updateOne({ $addToSet: { likes: likeKarneWaleUserKiId } }); //This ensures a single user can add a single like to a post
    await post.save();

    //Implementing socket.io for real time notification

    const user = await User.findById(likeKarneWaleUserKiId).select(
      "username profilePicture"
    );

    const postOwnerId = post.author.toString();

    if (postOwnerId !== likeKarneWaleUserKiId) {
      const notification = {
        type: "like",
        userId: likeKarneWaleUserKiId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post liked!", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likeKarneWaleUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });

    //Main like logic
    await post.updateOne({ $pull: { likes: likeKarneWaleUserKiId } }); //This ensures a single user can remove like from a post
    await post.save();

    //Implementing socket.io for real time notification
    const user = await User.findById(likeKarneWaleUserKiId).select(
      "username profilePicture"
    );

    const postOwnerId = post.author.toString();

    if (postOwnerId !== likeKarneWaleUserKiId) {
      const notification = {
        type: "dislike",
        userId: likeKarneWaleUserKiId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post disliked!", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKarneWalaUserKiId = req.id;

    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(400)
        .json({ message: "Text is required!", success: false });

    const comment = await Comment.create({
      text,
      author: commentKarneWalaUserKiId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });
    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment added!",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const Comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );
    if (!Comments)
      return res
        .status(404)
        .json({ message: "No comments found for this post!", success: false });

    return res.status(200).json({ success: true, Comments });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "No posts found!", success: false });

    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "Unauthorized access",
      });
    }

    await Post.findByIdAndDelete(postId);

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      //Already bookmarked thus remove
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      //Bookmark for first time
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "Post bookmarked ",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
