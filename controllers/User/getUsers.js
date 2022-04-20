const User = require("../../model/User");
const ROLES_LIST = require("../../config/roles_list")
const getUsersbySearch = async (req, res) => {
  // const { userquery, tags } = req?.query;
  const reqUserRoles = req.roles;

  try {

    const isAdmin = reqUserRoles.includes(ROLES_LIST.Admin);
    if (!isAdmin) { return res.status(400).json({ message: "You do not have permission to perform this action" }) }
    
    const allUsers = await User.find()

    return res.status(200).json(allUsers);
  } catch (error) {

    return res.sendStatus(500);
  }
};
module.exports = getUsersbySearch;
