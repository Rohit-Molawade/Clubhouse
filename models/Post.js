const mongoose = require('mongoose');
const intlFormat = require('date-fns/intlFormat');

const Schema = mongoose.Schema;

const Postschema = new Schema({
	author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	timestamp: { type: Date },
	title: { type: String, required: true, maxLength: 32 },
	content: { type: String, required: true, maxLength: 100 },
});

Postschema.virtual('date').get(function () {
	return intlFormat(this.timestamp, { year: 'numeric', month: 'long', day: 'numeric' });
});

Postschema.virtual('time').get(function () {
	return intlFormat(this.timestamp, { hour: 'numeric', minute: 'numeric' });
});

module.exports = mongoose.model('Post', Postschema);
