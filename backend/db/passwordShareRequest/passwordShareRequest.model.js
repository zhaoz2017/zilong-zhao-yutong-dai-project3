const mongoose = require("mongoose");
const PasswordModel = require("../password/password.model");

const PasswordShareRequestSchema =
  require("./passwordShareRequest.schema").PasswordShareRequestSchema;

const PasswordShareRequestModel = mongoose.model(
  "PasswordShareRequestModel",
  PasswordShareRequestSchema
);

async function acceptAndSharePasswordsMutually(requestId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const request = await PasswordShareRequestModel.findById(requestId)
      .session(session)
      .exec();
    if (!request) {
      throw new Error("Request not found");
    }

    await PasswordModel.sharePasswordsMutually(
      request.fromUser,
      request.toUser
    );
    request.status = "accepted";
    await request.save({ session });

    await session.commitTransaction();
    session.endSession();
    return request;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
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
