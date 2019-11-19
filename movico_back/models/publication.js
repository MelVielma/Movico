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
	publishedBy: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	author: {
		type: String,
		required: true
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
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

publicationSchema.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'publication'
})

const Publication = mongoose.model('Publication', publicationSchema)

module.exports = Publication
