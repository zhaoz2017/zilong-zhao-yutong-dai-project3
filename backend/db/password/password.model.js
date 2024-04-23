const mongoose = require("mongoose");

const PasswordSchema = require("./password.schema").PasswordSchema;

const PasswordModel = mongoose.model("PasswordModel", PasswordSchema);

function createPassword(passowrd) {
  return PasswordModel.create(passowrd);
}

function returnAllPassword() {
  return PasswordModel.find().exec();
}

function updatePasswordByUrlAndUser(username, url, newPassword) {
  return PasswordModel.findOneAndUpdate(
    { username: username, url: url },
    { password: newPassword }, // Simplified, assuming password field directly
    { new: true }
  ).exec();
}

function deletePasswordByUrlAndUser(username, url) {
  return PasswordModel.findOneAndDelete({
    username: username,
    url: url,
  }).exec();
}
async function sharePasswordsMutually(user1, user2) {
  try {
    // User1 的密码共享给 User2
    await PasswordModel.updateMany(
      { username: user1 },
      { $addToSet: { sharedWith: user2 } }
    );

    // User2 的密码共享给 User1
    await PasswordModel.updateMany(
      { username: user2 },
      { $addToSet: { sharedWith: user1 } }
    );
  } catch (error) {
    throw error; // 直接传递错误
  }
}
module.exports = {
  createPassword,
  returnAllPassword,
  updatePasswordByUrlAndUser,
  deletePasswordByUrlAndUser,
  sharePasswordsMutually,
};
