const Comment = require('../models/comment.js')

// 1. Creacion de comentario
const createComment = function(req, res) {
	const comment = Comment(req.body)
	comment.save().then(function() {
		return res.send(comment._id)
	}).catch(function(error) {
		return res.status(400).sned(error)
	})
}

// 2.  Eliminar comentario
const deleteComment = function(req, res) {
	Comment.findByIdAndDelete({ req.body }).then(function(user) {
		if(!comment) {
			return res.status(404).send()
		}
		return res.status(404).send()
	}).catch(function(error) {
		res.status(505).send(error)
	})
}

module.exports = {
	createComment : createComment,
	deleteComment : deleteComment
}