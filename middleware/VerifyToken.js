const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // console.log(req.cookies.aCCtknntBrfrsD);
  try {
    if (!authHeader) return res.sendStatus(401);
    const header = authHeader.split(" ");
    if (header[0] !== "Bearer") return res.sendStatus(401);
    const accessToken = header[1];

    jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.sendStatus(401);
      }

      req.user = decoded.UserInfo.username;
      req.userId = decoded.UserInfo.id;
      req.roles = decoded.UserInfo.roles;

      next();
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = verifyToken;
