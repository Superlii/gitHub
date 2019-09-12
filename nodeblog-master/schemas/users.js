const mongoose = require("mongoose")

// 定义一个表
module.exports = new mongoose.Schema({
  id:Number,
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
})