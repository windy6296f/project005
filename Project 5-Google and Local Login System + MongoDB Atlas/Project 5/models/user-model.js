const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 255,
  },

  // google login
  googleID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // 縮圖網址
  thumbnail: {
    type: String,
  },

  // local Login
  email: {
    type: String,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
});

module.exports = mongoose.model("User", userSchema);
