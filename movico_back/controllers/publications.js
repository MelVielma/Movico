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
	console.log('req.user',req.user)
	let isUserUndefined = false
	isUserUndefined = !(req.user === undefined)
	let isTypeeAdmin = false
	if (isUserUndefined) {
		isTypeeAdmin = req.user.typee==="admin"
	}
	
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
	let isUserUndefined = false
	isUserUndefined = !(req.user === undefined)
	let isTypeeAdmin = false
	if (isUserUndefined) {
		isTypeeAdmin = req.user.typee==="admin"
	}
	const _id = req.params.id
	

	if(isUserUndefined && isTypeeAdmin){
		//Los admin pueden ver TODAS las poblicaciones
		console.log("Entro como admin")
	
		Publication.find({_id}).populate('comments').then(function(publications){
			return res.send(publications)
		}).catch(function(error){
			return res.status(500).send(error)
		})
	}
	else
	{
		Publication.find({ _id, status: 'Enable' }).populate('comments').then(function(publications){
			return res.send(publications)
		}).catch(function(error){
			return res.status(500).send(error)
		})	
	}
}

//UPDATE - Actualiza la informacion de una publicacion
const updatePublication = function(req, res){
    console.log("req.body",req.body)
    if(req.user.typee=='userOnly'){
        return res.status(401).send({ error: 'Admins Only'})
    }

    console.log("Es admin")
	const _id = req.params.id
	console.log("_id",_id)
	console.log("updates a aplicar",req.body)
	Publication.findByIdAndUpdate(_id, req.body).then(function(publication){
		console.log("Se encontro una publicacion")
		if(!publication){
			console.log("no se encontro una pub")
			return res.status(404).send()
		}
		return res.send(publication._id)
	}).catch(function(error){
		console.log(error)
		res.status(500).send(error)
	})
}

//DELETE - Borra 
const deletePublication = function(req, res){
    if(req.user.typee=='userOnly'){
        return res.status(401).send({ error: 'Admins Only'})
    }

	const _id = req.params.id
	Publication.findByIdAndDelete(_id).then(function(publication){
		if(!publication){
			return res.status(404).send()
		}
		return res.send(publication._id)
	}).catch(function(error){
		return res.status(500).send(error)
	})
}

// POST - Habilita que la publicación pueda ser vista
const enablePublication = function(req, res) {
	if(req.user.typee=='userOnly'){
        return res.status(401).send({ error: 'Admins Only'})
    }
	const _id = req.params.id
	Publication.findOneAndUpdate({_id : _id}, {status: "Enable"}).then(function(publication){
		if(!publication){
			return res.status(404).send()
		}
		console.log(publication)
		return res.send(publication._id)
	}).catch(function(error){
		res.status(500).send(error)
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
    getSinglePublication: getSinglePublication,
    enablePublication: enablePublication
}