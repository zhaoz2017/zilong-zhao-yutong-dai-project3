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
    { $set: { password: newPassword } },
    { new: true }
  ).exec();
}

function deletePasswordByUrlAndUser(username, url) {
  return PasswordModel.findOneAndDelete({
    username: username,
    url: url,
  }).exec();
}

module.exports = {
  createPassword,
  returnAllPassword,
  updatePasswordByUrlAndUser,
  deletePasswordByUrlAndUser,
};
