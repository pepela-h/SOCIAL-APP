const User = require("../../model/User");
const mongoose = require("mongoose");
///////////////////////////////////////////////////////
const handleSave = async (req, res) => {
  const userId = req?.userId;
  const { id: postId } = req?.body;
  if (!mongoose.Types.ObjectId.isValid(postId)) return res.sendStatus(404);

  try {
    const duplicate = await User.findById(userId);
    const hasSaved =
      duplicate.savedPosts.findIndex((id) => id === String(postId)) !== -1;
    if (hasSaved) {
      duplicate.savedPosts = duplicate.savedPosts.filter(
        (post) => post !== postId
      );
    } else {
      duplicate.savedPosts = [...duplicate.savedPosts, postId];
    }

    await duplicate.save();
    return res.status(200).json(duplicate.savedPosts);
  } catch (error) {

    return res.sendStatus(500);
  }
};

module.exports = handleSave;
