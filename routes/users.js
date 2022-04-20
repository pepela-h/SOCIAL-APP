const express = require("express");
const router = express.Router();
const MessagingController = require("../controllers/Messaging/Messaging");
const verifyJWT = require("../middleware/VerifyToken");
router.route("/signup").post(require("../controllers/User/createUser"));
router.post("/signin", require("../controllers/User/Login"));
router.post("/signout", require("../controllers/User/logOut"));
router.post("/savePost", verifyJWT, require("../controllers/User/handleSave"));
router.post(
  "/follow/:username",
  verifyJWT,
  require("../controllers/User/followUser")
);
router.get("/profile/:username", require("../controllers/User/getProfile"));
router.get("/messages",verifyJWT, MessagingController.getUserMessages);
router.post("/messages",verifyJWT, MessagingController.addMessage);
router.get("/following", verifyJWT, MessagingController.getFollowing);

module.exports = router;
