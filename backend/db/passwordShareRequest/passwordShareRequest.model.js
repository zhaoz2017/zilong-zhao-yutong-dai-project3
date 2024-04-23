const mongoose = require("mongoose");
const PasswordModel = require("../password/password.model");

const PasswordShareRequestSchema =
  require("./passwordShareRequest.schema").PasswordShareRequestSchema;

const PasswordShareRequestModel = mongoose.model(
  "PasswordShareRequestModel",
  PasswordShareRequestSchema
);

async function acceptAndSharePasswordsMutually(requestId) {
  try {
    const request = await PasswordShareRequestModel.findById(requestId).exec();
    if (!request) {
      throw new Error("Request not found");
    }

    await PasswordModel.sharePasswordsMutually(
      request.fromUser,
      request.toUser
    );

    request.status = "accepted";
    await request.save();
    return request;
  } catch (error) {
    throw error; // 直接传递错误
  }
}
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
  acceptAndSharePasswordsMutually,
};
