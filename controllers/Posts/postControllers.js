const Post = require("../../model/post");
const User = require("../../model/User");
const mongoose = require("mongoose");
const ROLES_LIST = require("../../config/roles_list");


const getPosts = async (req, res) => {
  const response = await Post.find().sort({ _id: -1 });
  return res.status(200).json(response);
};

const createPost = async (req, res) => {
  const userName = req?.user;

  if (!userName) return res.sendStatus(401);
  try {

    const response = await Post.create({
      ...req?.body,
      creator: userName,
    });

    return res.status(200).json(response);
  } catch (error) {

    return res.sendStatus(500);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const userName = req?.user;
  // const roles = req?.roles;
  const reqUserRoles = req.roles;
  if (!userName) return res.sendStatus(403);

  try {
    const reqPost = await Post.findById(id);
    if (String(reqPost.creator) !== String(userName)) {
      const isAdmin = reqUserRoles.includes(ROLES_LIST.Admin);
      if (!isAdmin) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      }
    }
    await Post.findByIdAndDelete(id);
    return res.sendStatus(204);
  } catch (error) {

    return res.sendStatus(500);
  }
};

const getUserPosts = async (req, res) => {
  const { creator } = req?.query;
  const reqUser = await User.findOne({ username: creator });
  if (!reqUser) return res.sendStatus(404);
  try {
    // const creatorReg = new RegExp(creator, "i");
    const data = await Post.find({ creator: creator });
    return res.status(200).json(data);
  } catch (error) {

    return res.sendStatus(500);
  }
};

const handleLikes = async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.sendStatus(401);
  const { id: postId } = req?.body;
  if (!postId) return res.sendStatus(400);
  if (!mongoose.Types.ObjectId.isValid(postId)) return res.sendStatus(404);
  try {
    const reqPost = await Post.findById(postId);
    const hasLiked =
      reqPost.likes.findIndex((id) => id === String(userId)) !== -1;
    if (hasLiked) {
      reqPost.likes = reqPost.likes.filter((id) => id !== userId);
    } else {
      reqPost.likes.push(userId);
    }
    const resp = await reqPost.save();

    return res.status(200).json(resp);
  } catch (error) {

    return res.sendStatus(500);
  }
};

const handleComments = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { comment } = req?.body;
      const postId = req.params.id;

      const commentOwner = req?.user;
      if (!commentOwner) return res.sendStatus(401);

      const reqPost = await Post.findOne({ _id: postId });

      reqPost.comments.push({ comment, creator: commentOwner });

      const finalpost = await reqPost.save();

      return res.status(200).json(finalpost);
    } catch (error) {

      return res.sendStatus(500);
    }
  } else if (req.method === "GET") {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.sendStatus(404);
    try {
      const reqPost = await Post.find({ _id: postId });

      return res.status(200).json(reqPost.comments);
    } catch (error) {

      return res.sendStatus(500);
    }
  }
};
const handleReports = async (req, res) => {
  try {
    const postId = req.params.id;

    const reqPost = await Post.findOne({ _id: postId });

    reqPost.reported.push(true);
  
    await reqPost.save();

    return res.sendStatus(200);
  } catch (error) {

    return res.sendStatus(500);
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  getUserPosts,
  handleLikes,
  handleComments,
  handleReports,
};
