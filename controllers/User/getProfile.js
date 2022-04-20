const User = require("../../model/User");
const getUserProfile = async (req, res) => {
  const usersName = req.params.username;

  try {
    const reqUser = await User.findOne({ username: usersName });
    if (!reqUser) {
      return res.sendStatus(404);
    }
    const {roles, username, followers, image, email, gender, occupation, following } =
      reqUser;
    const data = {
      username,
      followers,
      image,
      email,
      gender,
      occupation,
      following,
      roles,
    };
    return res.status(200).json(data);
  } catch (error) {

    return res.sendStatus(500);
  }
};
module.exports = getUserProfile;
