const Publication = require('../models/publication.js')
const bcrypt = require('bcryptjs')

//POST - Creacion de publicacion
const createPublication = function(req, res){
	data = req.body
	info = {
		title : data.title,
		business_name : data.business_name,
		author : data.author,
		text : data.text,
		media : data.media,
		tags : data.tags,
		date : data.date,
		status : 'Enable'
	}
	const publication = new Publication(info)
	publication.save().then(function(){
		return res.send(publication._id)
	}).catch(function(error){
		return res.status(400).send(error)
	})

//GET - Consulta de publicaciones autor
const getByAuthor = function(req, res){
	const _author = req.publication.author 
	Publication.findById(_author).then(function(publication){
		if(!publication){
			return res.status(404).send(publication)
		}
		return res.send(publication)
	}).catch(function(error){
		return res.status(500).send(error)
	})
}

//GET- Consulta de publicaciones por etiqueta
//NO PUDE HACERLO, se debe modificar la estructura de tags en publication.js

//GET - Consulta TODAS las publicaciones
const getAllPublications = function(req, res){
	Publication.find({ status: 'Enable' }).then(function(publications){
		return res.send(publications)
	}).catch(function(error){
		return res.status(500).send(error)
	})
}

//UPDATE - Actualiza la informacion de una publicacion
const updatePublication = function(req, res){
	const _id = req.publication._id
	const update = Object.keys(req.body)
	Publication.findOneAndUpdate(_id, req.body).then(function(publication){
		if(!publication){
			return res.status(404).send()
		}
		return res.send(publication._id)
	}).catch(function(error){
		res.status(500).send(error)
	})
}

//DELETE - Borra 
const deletePublication = function(req, res){
	const _id = req.publication._id
	Publication.findOneAndDelete(_id).then(function(publication){
		if(!publication){
			return res.status(404).send()
		}
		return res.send(publication._id)
	}).catch(function(error){
		return res.status(500).send(error)
	})
}

module.exports = {
	createPublication: createPublication,
	getAllPublications: getAllPublications,
	getByAuthor: getByAuthor,
	updatePublication: updatePublication,
	deletePublication: deletePublication
}