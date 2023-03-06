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
    },

    // Delete a reaction
    deleteReaction(req, res) {
        Reaction.findOneAndDelete({ _id: req.params.reactionId })
            .then((reaction) =>
                !reaction
                    ? res.status(404).json({ message: 'No reaction with that ID' })
                    : Thought.findOneAndUpdate(
                        { _id: reaction.thoughtId },
                        { $pull: { reactions: req.params.reactionId } },
                        { new: true, runValidators: true }
                    )
            )
            .then(() => res.json({ message: 'Reaction deleted!' }))
            .catch((err) => res.status(500).json(err));
    },
    async getReactions(req, res) {
        try {
            const reaction = await Reaction.findById(req.params.reactionId);
            if (!reaction) {
                return res.status(404).json({ message: 'Reaction not found' });
            }
            res.json(reaction);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    }
};
