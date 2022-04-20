const User = require("../../model/User");
const ROLES_LIST = require("../../config/roles_list");
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const reqRoles = req.roles;
  if (!id) return res.status(400).json({ message: "Something happened" });
  try {
    const isAdmin = reqRoles.includes(ROLES_LIST.Admin);
    if (!isAdmin) return res.status(401).json({ message: "Unauthorized" });
    const requestedUser = await User.findByIdAndDelete(id);
    return res.status(200).json(requestedUser);
  } catch (error) {

    return res.sendStatus(500);
  }
};
module.exports = deleteUser;