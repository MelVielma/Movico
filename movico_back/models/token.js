const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	token: {
		type: String,
		required: true
	}
})

const Token = mongoose.model('Token', tokenSchema)
module.exports = Token