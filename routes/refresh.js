const express = require("express");
const router = express.Router();
const refreshControllers = require("../controllers/Refresh/refresh");

router
  .route("/")
  .post(refreshControllers.refreshTokenController)
  .get(refreshControllers.ErrorHandler)
  .delete(refreshControllers.ErrorHandler)
  .put(refreshControllers.ErrorHandler)
  .patch(refreshControllers.ErrorHandler);

module.exports = router;
