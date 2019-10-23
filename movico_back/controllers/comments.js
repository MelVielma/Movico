const Comment = require('../models/comment.js')
const Publication = require('../models/publication.js')
var jsdom = require('jsdom');

if(process.env.NODE_ENV==='production'){
  var apiKey = process.env.apiKey
}
else{
  const credentials = require('../config.js')
  var apiKey = credentials.apiKey
}

// 1. Creacion de comentario
const createComment = function(req, res) {
	const comment = Comment(req.body)
	Comment.save().then(function() {
		return res.send(comment._id)
	}).catch(function(error) {
		return res.status(400).sned(error)
	})
}

// 2.  Eliminar comentario
const deleteComment = function(req, res) {
	reqBody=req.body
	Comment.findByIdAndDelete({ reqBody  }).then(function(user) {
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