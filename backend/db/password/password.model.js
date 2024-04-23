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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // User1 的密码共享给 User2
    await this.updateMany(
      { username: user1 },
      { $addToSet: { sharedWith: user2 } },
      { session }
    ).exec();
    // User2 的密码共享给 User1
    await this.updateMany(
      { username: user2 },
      { $addToSet: { sharedWith: user1 } },
      { session }
    ).exec();

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}
module.exports = {
  createPassword,
  returnAllPassword,
  updatePasswordByUrlAndUser,
  deletePasswordByUrlAndUser,
  sharePasswordsMutually,
};
