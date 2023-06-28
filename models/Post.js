const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Postschema = new Schema({
    Author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    timestamp: {type: Date},
    title: { type: String, required: true, maxLength: 32 },
    content: { type: String, required: true, maxLength: 100 },
});

export const Post = mongoose.model('Post', Postschema);