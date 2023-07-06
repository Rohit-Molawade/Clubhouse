console.log('This script populates some Users and Posts to your database.');

require('dotenv').config();
const Avatar = require('./models/Avatar');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(process.env.Mongo_URL);
  console.log('Debug: Should be connected?');
  await createAvatar();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function AvatarCreate(name) {
  const avatar = new Avatar({
    name,
  });

  await avatar.save();
  console.log(`Added category: ${name}`);
}

async function createAvatar() {
  console.log('Adding users');
  await Promise.all([AvatarCreate('nyx')]);
}
