const Publication = require('../models/publication.js')
const bcrypt = require('bcryptjs')

//POST - Creacion de publicacion
const createPublication = function(req, res){
	console.log(req)
	data = req.body
	info = {
		title : data.title,
		business_name : data.business_name,
		author : data.author,
		text : data.text,
		media : data.media,
		tags : data.tags,
		date : data.date,
		publishedBy: data.idpub,
		status : 'Disable'
	}
	const publication = new Publication(info)
	publication.save().then(function(){
		return res.send(publication._id)
	}).catch(function(error){
		return res.status(400).send(error)
	})
}

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

const getByTag = function(req, res){
    const _tag=req.publication.tag
    Publication.find({tags: { $elemMatch: { $eq: _tag } }}).then(function(publication){
		if(!publication){
			return res.status(404).send(publication)
		}
		return res.send(publication)
	}).catch(function(error){
		return res.status(500).send(error)
	})
}

//GET - Consulta de publicaciones por etiquetas
const getByTags = function(req, res){
    const _tags=req.publication.tags
    Publication.find({ tags: { $all: _tags } }).then(function(publication){
		if(!publication){
			return res.status(404).send(publication)
		}
		return res.send(publication)
	}).catch(function(error){
		return res.status(500).send(error)
	})
}

//GET - Consulta TODAS las publicaciones
const getAllPublications = function(req, res){
	//Los usuarios solo pueden ver las publicaciones habilitadas
	console.log(req.user)
	console.log(typeof(req.user.typee))
	let isUserUndefined = !(req.user === undefined)
	let isTypeeAdmin = req.user.typee==="admin"

	if(isUserUndefined && isTypeeAdmin){
		//Los admin pueden ver TODAS las poblicaciones
		console.log("Entro como admin")
	
		Publication.find({}).then(function(publications){
			return res.send(publications)
		}).catch(function(error){
			return res.status(500).send(error)
		})
	}
	else
	{
		Publication.find({ status: 'Enable' }).then(function(publications){
			return res.send(publications)
		}).catch(function(error){
			return res.status(500).send(error)
		})	
	}
}

//GET - Consulta la publicación especificada
const getSinglePublication = function(req, res){
	//Los usuarios solo pueden ver las publicaciones habilitadas
	let isUserUndefined = !(req.user === undefined)
	let isTypeeAdmin = req.user.typee==="admin"
	const _id = req.params.id
	

	if(isUserUndefined && isTypeeAdmin){
		//Los admin pueden ver TODAS las poblicaciones
		console.log("Entro como admin")
	
		Publication.find({_id}).then(function(publications){
			return res.send(publications)
		}).catch(function(error){
			return res.status(500).send(error)
		})
	}
	else
	{
		Publication.find({ _id, status: 'Enable' }).then(function(publications){
			return res.send(publications)
		}).catch(function(error){
			return res.status(500).send(error)
		})	
	}
}

//UPDATE - Actualiza la informacion de una publicacion
const updatePublication = function(req, res){
    console.log(req)
    if(req.user.typee=='userOnly'){
        return res.status(401).send({ error: 'Admins Only'})
    }
	const _id = req.body._id

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
    if(req.user.typee=='userOnly'){
        return res.status(401).send({ error: 'Admins Only'})
    }

	const _id = req.params._id
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
    deletePublication: deletePublication,
    getByTag: getByTag,
    getByTags: getByTags,
    getSinglePublication: getSinglePublication

}