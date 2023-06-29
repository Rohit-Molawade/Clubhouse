console.log('This script populates some Users and Posts to your database.');

require('dotenv').config();
const Post = require('./models/Post.js');
const User = require('./models/User.js');

const users = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(process.env.Mongo_URL);
  console.log('Debug: Should be connected?');
  await createUser();
  await createpost();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function UserCreate(first_name, last_name, email, password, membership_status) {
  userdetail = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
    membership_status: membership_status,
  };
  const user = new User(userdetail);

  await user.save();
  users.push(user);
  console.log(`Added category: ${first_name}`);
}

async function postCreate(author, timestamp, title, content) {
  postdetail = {
    author: author,
    timestamp: timestamp,
    title: title,
    content: content,
  };

  const post = new Post(postdetail);
  await post.save();
  console.log(`Added post: ${title}`);
}

async function createUser() {
  console.log('Adding users');
  await Promise.all([
    UserCreate('Jake', 'White', 'jake-white@gmail.com', 'JakeWhite12', 'false', 'Hades.webp'),
    UserCreate('Paul', 'Allen', 'paul0211@gmail.com', 'offwhitecoloring', 'true', 'Zagreus.webp'),
    UserCreate('Walter', 'White', 'walter-white@gmail.com', 'heisenberg', 'true', 'Thanatos.webp'),
    UserCreate('Jesse', 'Pinkman', 'jesse-pinkman@gmail.com', 'jesse121', 'false', 'Megaera.webp'),
  ]);
}

async function createpost() {
  console.log('Adding posts');
  await Promise.all([
    postCreate(users[0], new Date('2023-06-29'), 'Kung Fu Panda', "Shifu: If you only do what you can do, you'll never be more than you are now."),
    postCreate(users[1], new Date('2023-05-12'), 'American Psycho', 'Patrick Bateman: I have to return some videotapes.'),
    postCreate(
      users[2],
      new Date('2022-01-11'),
      'Breaking Bad',
      `Walter White: Say my name. \n Declan: Heisenberg. \n Walter White: You're goddamn right.`
    ),
    postCreate(users[3], new Date('2022-01-12'), 'Breaking Bad', 'Jesse Pinkman: Yeah, science!'),
  ]);
}
