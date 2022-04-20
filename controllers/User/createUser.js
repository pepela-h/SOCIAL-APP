const User = require("../../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { username, password, email, phoneNumber } = req?.body;

  if (!username || !password || !email || !phoneNumber) {
    return res.status(400).json({ message: "Please input required fields" });
  }

  try {
    const [duplicate] = await User.find({
      $or: [
        { email: email },
        { username: username },
        { phoneNumber: phoneNumber },
      ],
    });

    if (duplicate) {
      return res.status(409).json({ message: "Duplicate account" });
    }

    const hashedPWD = await bcrypt.hash(password, 12);
    const response = await User.create({ ...req.body, password: hashedPWD });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: response.username,
          id: response._id,
          roles: response.roles,
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
          username: response.username,
          id: response._id,
          roles: response.roles,
        },
      },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "10d",
      }
    );
    response.refreshToken = refreshToken;
    await response.save();
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
      user: response.username,
      id: response._id,
      email: response.email,
      savedPosts: response?.savedPosts,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = createUser;
