const User = require("../../model/User");

const handleFollow = async (req, res) => {
  const followedUser = req.params.username;
  if (!followedUser) return res.sendStatus(400);
  const reqUserId = req.userId;
  if (!reqUserId) return res.sendStatus(403);

  try {
    const matchedUser = await User.findOne({ username: followedUser });
    const followingP = await User.findOne({ _id: reqUserId });

    if (!matchedUser || !followingP) return res.sendStatus(400);
    const hasFollowed = matchedUser.followers.indexOf(reqUserId) !== -1;
    if (hasFollowed) {
      matchedUser.followers = matchedUser.followers.filter((followed) => {
        return String(followed) !== String(reqUserId);
      });
      followingP.following = followingP.following.filter(
        (follow) => String(follow) !== String(matchedUser._id)
      );
    } else {
      matchedUser.followers.push(reqUserId);
      followingP.following.push(matchedUser._id);
    }

    await followingP.save();
    const final = await matchedUser.save();
    const { username, followers,following, image, email, gender, occupation } = final;
    const data = {
      username,
      followers,
      image,
      email,
      gender,
      occupation,
      following
    };
    return res.status(200).json(data);
  } catch (error) {

    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = handleFollow;
