const connection = require('../config/connection');
const { User, Thought, Reaction } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing data
  await User.deleteMany({});
  await Thought.deleteMany({});
  await Reaction.deleteMany({});

  // Create empty array to hold the users
  const users = [];

  // Loop 10 times -- add users to the users array
  for (let i = 0; i < 10; i++) {
    const username = `user${i}`;
    const email = `${username}@example.com`;

    users.push({
      username,
      email,
    });
  }

  // Add users to the collection and await the results
  const createdUsers = await User.insertMany(users);

  // Create empty array to hold the thoughts
  const thoughts = [];

  // Loop 20 times -- add thoughts to the thoughts array
  for (let i = 0; i < 20; i++) {
    const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const thoughtText = `Thought ${i} by ${user.username}`;
    const createdAt = new Date();

    thoughts.push({
      thoughtText,
      user: user._id,
      username: user.username,
      createdAt,
    });
  }

  // Add thoughts to the collection and await the results
  const createdThoughts = await Thought.insertMany(thoughts);

  // Create empty array to hold the reactions
  const reactions = [];

  // Loop 50 times -- add reactions to the reactions array
  for (let i = 0; i < 50; i++) {
    const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const thought = createdThoughts[Math.floor(Math.random() * createdThoughts.length)];
    const reactionBody = `Reaction ${i} by ${user.username}`;
    const createdAt = new Date();

    reactions.push({
      reactionBody,
      user: user._id,
      username: user.username,
      thought: thought._id,
      createdAt,
    });
  }

  // Add reactions to the collection and await the results
  await Reaction.insertMany(reactions);

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.table(thoughts);
  console.table(reactions);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
