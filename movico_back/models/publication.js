const mongoose = require('mongoose')
const validator = require('validator')

const publicationSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},

	business_name: {
		type: String,
		required: true

	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true, 
		ref: 'User'
	},
	text: {
		type: [String],
		required: true
	},
	media: {
		type: String,
		required: true
	},
	tags: {
		type: [String],
	},
	date: {
		type: Date,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	lastModifiedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	lastModified: {
		type: Date
	}
});

const Publication = mongoose.model('Publication', publicationSchema)

module.exports = Publication