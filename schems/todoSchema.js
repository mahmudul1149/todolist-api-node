const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  released: {
    type: String,
  },
});

module.exports = todoSchema;
