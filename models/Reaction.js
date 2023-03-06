const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema({
  reactionId: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAt) => createdAt.toLocaleString()
  },
  thought: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thought",
    required: true
  }
});

const Reaction = mongoose.model("Reaction", ReactionSchema);

module.exports = Reaction;
