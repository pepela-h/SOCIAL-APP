const User = require("../../model/User");
const handleLogout = async (req, res) => {
  const { id: userId } = req?.body;
  try {
    if (!userId) return res.sendStatus(204);
    const duplicate = await User.findOne({ _id: userId });
    if (!duplicate) return res.sendStatus(204);
    duplicate.refreshToken = "";
    await duplicate.save();

    res.clearCookie("jwt", {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      httpOnly: true,
      secure: true,
      path: "/refresh",
      domain: "localhost",
    });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = handleLogout;
