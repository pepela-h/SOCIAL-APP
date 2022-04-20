const jwt = require("jsonwebtoken");
const User = require("../../model/User");

const refreshTokenController = async (req, res) => {
  const refreshToken = req?.cookies?.jwt;

  const { id: userId } = req?.body;
  if (!refreshToken || !userId) return res.sendStatus(403);
  try {
    const duplicate = await User.findOne({ _id: userId });

    if (!duplicate) return res.sendStatus(400);
    const tokenMatch = duplicate?.refreshToken === refreshToken;
    if (!tokenMatch) return res.sendStatus(401);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN,
      async (err, decoded) => {
        if (err) {
          return res.sendStatus(401);
        }
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: decoded.UserInfo.username,
              id: duplicate._id,
              roles: duplicate.roles,
            },
          },
          process.env.ACCESS_TOKEN,
          { expiresIn: "4m" }
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
          priority: 1,
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
      }
    );
  } catch (error) {
    res.sendStatus(500);
  }
};

const ErrorHandler = (req, res) => {
  const method = req.method;
  if (method !== "POST") return res.sendStatus(407);
};
module.exports = { refreshTokenController, ErrorHandler };
