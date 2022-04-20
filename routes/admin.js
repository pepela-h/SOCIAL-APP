const express = require("express");
const router = express.Router();
// const refreshControllers = require("../controllers/Admin/admin");
const verifyJWT = require("../middleware/VerifyToken");
router.get(
  "/dashboard/users",
  verifyJWT,
  require("../controllers/User/getUsers")
);
router.get(
  "/dashboard/reported",
  verifyJWT,
  require("../controllers/Admin/admin").getReported
);
router.get(
  "/dashboard/count",
  verifyJWT,
  require("../controllers/Admin/admin").getCount
);

router.delete('/dashboard/clr',verifyJWT, require("../controllers/Admin/admin").clearDB)

module.exports = router;
