const User = require("../../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { username, password, email, phoneNumber } = req?.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please input required fields" });
  }

  try {
    const [duplicate] = await User.find({
      $or: [{ username: username }],
    });

    if (!duplicate) {
      return res.status(401).json({ message: "No user exists" });
    }
    const passwordMatch = await bcrypt.compare(password, duplicate.password);
    if (!passwordMatch)
      return res.status(403).json({ message: "wrong password" });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: duplicate.username,
          id: duplicate._id,
          roles: duplicate.roles,
        },
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "4m",
      }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          username: duplicate.username,
          id: duplicate._id,
          roles: duplicate.roles,
        },
      },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "10d",
      }
    );
    duplicate.refreshToken = refreshToken;
    await duplicate.save();
    res.cookie("aCCtknntBrfrsD", accessToken, {
      sameSite: "None",
      httpOnly: false,
      secure: true,
      path: "/",
      domain: "localhost",
      maxAge: 1000 * 60 * 60 * 24 * 10,
    });
    res.cookie("jwt", refreshToken, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      httpOnly: true,
      secure: true,
      path: "/refresh",
      domain: "localhost",
    });
    return res.status(200).json({
      user: duplicate.username,
      id: duplicate._id,
      email: duplicate.email,
      savedPosts: duplicate?.savedPosts,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = loginUser;
