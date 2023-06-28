const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Userschema = new Schema({
    first_name: { type: String, required: true, maxLength: 32 },
    last_name: { type: String, required: true, maxLength: 32 },
    email: { type: String, required: true },
    password: { type: String, required: true },
    membership_status: {type: String, required: true },
    avatar_url: String,
});

export const User = mongoose.model('User', Userschema);
