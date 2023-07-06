const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Avatarschema = new Schema({
    name: { type: String, required: true },
});

 module.exports = mongoose.model('Avatar', Avatarschema);