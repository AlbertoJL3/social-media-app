const { Thought, Reaction } = require("../models");

module.exports = {
  // Create a reaction for a thought
  createReaction(req, res) {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    Reaction.create({ reactionBody, username, thought: thoughtId })
      .then((reaction) =>
        Thought.findByIdAndUpdate(
          thoughtId,
          { $push: { reactions: reaction._id } },
          { new: true }
        )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  }
};
