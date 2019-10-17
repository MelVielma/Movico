const User = require('../models/user.js')
const bcrypt = require('bcryptjs')

// POST - Creacion de usuario
const createUser = function(req, res) {
	console.log("ando en create")
	data = req.body
	console.log(data.name)
	info = {
		name : data.name,
		email : data.email,
		password : data.password,
		about: data.about,
		status: 'Enable',
		typee: 'admin'
	}

	const user = new User(info)
	user.save().then(function() {
		return res.send(user._id)
	}).catch(function(error) {
		return res.status(408).send(error)
	})
}


// POST - Login de usuario
const login = function(req, res) {
	console.log("ando en login")
	User.findByCredentials(req.body.email, req.body.password).then(function(user){
		user.generateToken().then(function(token){
		  return res.send({user, token})
		}).catch(function(error){
		  return res.status(401).send({ error: error })
		})
	  }).catch(function(error) {
		return res.status(401).send({ error: error })
	  })
}

// POST - Logout de usuario
const logout = function(req, res){
	req.user.authToken = req.user.authToken.filter(function(token) {
		return token.token !== req. token
	})
	req.user.save().then(function() {
		return res.send()
	}).catch(function(error) {
		return res.status(500).send({ error: error })
	})
}

//CHECAR COMO SE HACE ESTO, QUE ENCUENTRE LOS RESULTADOS SIMILIARES, NO TAL CUALES
//Hice lo de regex, a ver qué tal sale 
// GET - Consulta de usuarios por nombre de usuario
const findUsers = function(req, res) {
	User.find({ name: new RegExp(req.body.name, 'i') }).exec(function(error, users) {
		return res.send(users)
	}).catch(function(error){
		res.status(500).send(error)
	})
}

// GET - Consulta de usuarios
const getAllUsers = function(req, res) {
	User.find({ status: 'Enable' }).then(function(users) {
		res.send(users)
	}).catch(function(error){
		res.status(500).send(error)
	})
}

// PATCH - Actualizar al usuario
const updateUser = function(req, res) {
	const _id = req.user._id
	const updates = Object.keys(req.body)
	const allowedUpdates = ['name', 'about', 'password','status']
	const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidUpdate) {
		return res.status(400).send({
			error: 'Invalid update, only parameters allowed to update: ' + allowedUpdates
		})
	}
	User.findByIdAndUpdate(_id, req.body).then( function(user) {
		if(!user) {
			return res.status(404).send()
		}
		return res.send(user._id)
	}).catch(function(error) {
		res.status(500).send(error)
	})
}

// PATCH - Eliminar una cuenta de usuario
const disableUser = function(req, res) {
	User.findByIdAndUpdate(_id, { status: 'Disable' }).then( function(user) {
		if(!user) {
			return res.status(404).send()
		}
		return res.send(user._id)
	}).catch(function(error) {
		res.status(500).send(error)
	})
}

module.exports = {
	createUser : createUser,
	login : login,
	logout : logout,
	findUsers : findUsers,
	getAllUsers : getAllUsers,
	updateUser : updateUser,
	disableUser : disableUser
}