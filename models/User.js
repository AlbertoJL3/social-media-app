const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  thoughts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Thought"
    }
  ],
  friends: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  ]
}, {
  toJSON: {
    virtuals: true
  }
});

UserSchema.virtual("friendCount").get(function() {
  return this.friends.length;
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
