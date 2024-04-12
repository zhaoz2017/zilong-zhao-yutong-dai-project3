const Schema = require('mongoose').Schema;

exports.PasswordSchema = new Schema({
    url: {
        type: String,
        required: true,
      },
    password: {
        type: String,
        required: true,
      },
    date: {
        type: Date,
        required: Date.now,
    },
    username: {
      type: String,
      required: true,
  },
  
}, { collection : 'myPasswordSp24' });

