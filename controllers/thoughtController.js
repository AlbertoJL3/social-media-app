const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thoughts) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Add a thought to another user's post
  addThought(req, res) {
    const { thoughtId } = req.params;
    const { username } = req.body;

    User.findOneAndUpdate(
      { username: username },
      { $push: { thoughts: thoughtId } },
      { new: true, runValidators: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that username' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a thought from another user's post
  removeThought(req, res) {
    const { thoughtId } = req.params;
    const { username } = req.body;

    User.findOneAndUpdate(
      { username: username },
      { $pull: { thoughts: thoughtId } },
      { new: true, runValidators: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that username' })
          : Thought.findOneAndDelete({ _id: thoughtId })
      )
      .then(() => res.json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.deleteMany({ _id: { $in: thought.users } })
      )
      .then(() => res.json({ message: 'thought and users deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add a reaction to a thought
  addReaction(req, res) {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    Reaction.create({ reactionBody, username })
      .then((reaction) =>
        Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $push: { reactions: reaction } },
          { new: true }
        )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

};
