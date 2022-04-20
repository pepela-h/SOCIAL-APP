const express = require("express");
const router = express.Router();
const employeesController = require("../controllers/Posts/postControllers");
// const verifyToken = require("../middleware/VerifyToken")
const verifyJWT = require("../middleware/VerifyToken");

router
  .route("/")
  .get(employeesController.getPosts)
  .post(verifyJWT, employeesController.createPost);
router.delete("/:id", verifyJWT, employeesController.deletePost);
router.get("/search", employeesController.getUserPosts);
router.post("/like", verifyJWT, employeesController.handleLikes);
router.post("/comment/:id", verifyJWT, employeesController.handleComments);
router.post("/report/:id", verifyJWT, employeesController.handleReports);
router.get("/:id/comments", verifyJWT, employeesController.handleComments);
module.exports = router;
