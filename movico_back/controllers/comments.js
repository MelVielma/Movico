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
	console.log("req.body", req.body)
	const comment = new Comment({
		user: req.body.user,
		publication: req.params.id,
		text: req.body.text,
		date: req.body.date
	  })
	console.log("comment", comment)
	comment.save().then(function() {
		return res.send(comment)
	}).catch(function(error) {
		console.log(error)
		return res.status(400).send(error)
	})
}

// 2.  Eliminar comentario
const deleteComment = function(req, res) {
	console.log("ANDO EN deleteComment")
	const _id = req.params.id
	console.log("el id que recibí fue", _id)
	Comment.findByIdAndDelete(_id).then(function(comment) {
		if(!comment) {
			console.log("no se encontró un comment")
			return res.status(404).send()
		}
		console.log("se encontró un comment")
		return res.send()
	}).catch(function(error) {
		console.log("error", error)
		res.status(505).send(error)
	})
}

module.exports = {
	createComment : createComment,
	deleteComment : deleteComment
}