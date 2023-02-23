const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// Aggregate function to get the number of students overall
const headCount = async () =>
    User.aggregate()
        .count('userCount')
        .then((numberOfUsers) => numberOfUsers);

// Aggregate function for getting the reactions
const getReaction = async (userId, reactionId) =>
    User.aggregate([
        { $match: { _id: ObjectId(userId) } },
        {
            $project: {
                reaction: {
                    $filter: {
                        input: '$reactions',
                        as: 'reaction',
                        cond: { $eq: ['$$reaction._id', ObjectId(reactionId)] },
                    },
                },
            },
        },
    ]).then((users) => {
        const user = users[0];
        return user.reaction.length > 0 ? user.reaction[0] : null;
    });

module.exports = {
    // Get all users
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                    userCount: await headCount(),
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Get a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId }).select('-__v');
            if (!user) {
                return res.status(404).json({ message: 'No User with that ID' });
            }
            const reaction = await getReaction(req.params.userId, req.params.reactionId);
            return res.json({ user, reaction });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    async updateUser (req, res) {
        try {
          const user = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true }
          );
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          return res.json(user);
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      },
    // Delete a user and remove them from the course
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndRemove({ _id: req.params.userId });
            if (!user) {
                return res.status(404).json({ message: 'No such user exists' });
            }
            await Thought.deleteMany({ username: user.username });
            return res.json({ message: 'User successfully deleted' });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // Add a reaction to a user
    addReaction(req, res) {
        console.log('You are adding a reaction');
        console.log(req.body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with that ID :(' });
                }
                return res.json(user);
            })
            .catch((err) => res.status(500).json(err));
    },
    // Remove reaction from a user
    removeReaction(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { reactions: { _id: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'No user found with that ID :(' })
                    : res.json(z)
            )
            .catch((err) => res.status(500).json(err));
    },
};
