const Message = require("../../model/Message");
const User = require("../../model/User");
const mongoose = require("mongoose");

const getUserMessages = async (req, res) => {
  const { to } = req?.query;
  const verified = req.userId;

  try {
    const messages = await Message.find({
      users: { $all: [verified, to] },
    }).sort({
      createdAt: 1,
    });

    const mod = messages.map((message) => {
      return {
        fromSelf: String(message.from) === String(verified),
        message: message.message.text,
        createdAt: message.createdAt,
      };
    });

    return res.json(mod);
  } catch (error) {

    return res.sendStatus(500);
  }
};

const addMessage = async (req, res) => {
  const { msg, to } = req?.body;
  if (!mongoose.Types.ObjectId.isValid(to)) return res.sendStatus(400);
  try {
    await Message.create({
      message: {
        text: msg,
      },
      from: req?.userId,
      users: [req.userId, to],
    });
    return res.sendStatus(201);
  } catch (error) {

    return res.sendStatus(500);
  }
};

const getFollowing = async (req, res) => {
  const reqUserId = req?.userId;
  if (!reqUserId) return res.sendStatus(401);

  try {
    const gotten = await User.findById(reqUserId);
    if (!gotten) return res.sendStatus(404);
    const peopleFollowing = gotten?.following;
    const followers = gotten?.followers;

    const reqPeople = await User.find({
      _id: { $in: [...peopleFollowing, ...followers] },
    }).select(["username", "_id"]);

    return res.status(200).json(reqPeople);
  } catch (error) {

    return res.sendStatus(500);
  }
};

module.exports = { getUserMessages, addMessage, getFollowing };
