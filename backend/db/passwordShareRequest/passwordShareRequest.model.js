const mongoose = require("mongoose");

const PasswordShareRequestSchema =
  require("./passwordShareRequest.schema").PasswordShareRequestSchema;

const PasswordShareRequestModel = mongoose.model(
  "PasswordShareRequestModel",
  PasswordShareRequestSchema
);

function createShareRequest(data) {
  return PasswordShareRequestModel.create(data);
}

function getShareRequests(username) {
  return PasswordShareRequestModel.find({ toUser: username }).exec();
}

function acceptShareRequest(requestId) {
  return PasswordShareRequestModel.findByIdAndUpdate(
    requestId,
    { $set: { status: "accepted" } },
    { new: true }
  ).exec();
}

function rejectShareRequest(requestId) {
  return PasswordShareRequestModel.findByIdAndUpdate(
    requestId,
    { $set: { status: "rejected" } },
    { new: true }
  ).exec();
}

module.exports = {
  createShareRequest,
  getShareRequests,
  acceptShareRequest,
  rejectShareRequest,
};
