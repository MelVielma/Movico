const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	publication: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Publication'
	},
	text: {
		type: String
	}
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment