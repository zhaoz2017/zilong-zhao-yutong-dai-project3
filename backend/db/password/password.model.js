const mongoose = require("mongoose")

const PasswordSchema = require('./password.schema').PasswordSchema;

const PasswordModel = mongoose.model("PasswordModel", PasswordSchema);

function createPassword(passowrd) {
    return PasswordModel.create(passowrd);
}

function returnAllPassword() {
    return PasswordModel.find().exec();
}

module.exports = {
    createPassword,
    returnAllPassword,
}