const Post = require("../../model/post");
const ROLES_LIST = require("../../config/roles_list");
const User = require("../../model/User");
const Message = require("../../model/Message");
const deletedUsers = require("../../model/deletedUsers");

const getReported = async (req, res) => {
  try {
    const reqUserRoles = req.roles;

    const isAdmin = reqUserRoles.includes(ROLES_LIST.Admin);
    if (!isAdmin) {
      return res.status(400).json({
        message: "You do not have permission to perform this action",
      });
    }

    const posts = await Post.find({ "reported.0": { $exists: true } });

    return res.status(200).json(posts);
  } catch (error) {
    return res.sendStatus(500);
  }
};

const getCount = async (req, res) => {
  const reqUserRoles = req.roles;
  try {
    const isAdmin = reqUserRoles.includes(ROLES_LIST.Admin);
    if (!isAdmin) {
      return res.status(400).json({
        message: "You do not have permission to perform this action",
      });
    }

    const totalPosts = await Post.count();
    const totalUsers = await User.count();
    const messages = await Message.count();

    return res.status(200).json({ totalPosts, totalUsers, messages });
  } catch (error) {
    return res.sendStatus(500);
  }
};

const clearDB = async (req, res) => {
  const roles = req.roles;

  if (!roles)
    return res
      .status(401)
      .json({ message: "You don't have permission to do that'" });

  if (!roles.includes(ROLES_LIST.Admin) && !roles.includes(ROLES_LIST.Editor))
    return res
      .status(401)
      .json({ message: "You don't have permission to do that'" });

  try {
    await Post.deleteMany({});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Users Deleted then an error occurred" });
  }
  try {
    await Message.deleteMany({});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Users,Post Deleted then an error occurred" });
  }
  try {
    await deletedUsers.deleteMany({});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Users,Post,Message Deleted then an error occurred" });
  }
  return res.sendStatus(200);
};

module.exports = { getReported, getCount, clearDB };
