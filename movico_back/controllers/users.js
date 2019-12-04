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
		typee: 'userOnly'
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
	User.findByCredentials(req.body.email, req.body.password).then(function(user){
		//Checamos que no haya "Eliminado" su cuenta.

		if (user.status == 'Disable') {
			return res.status(401).send({error: 'Email not found.'})
		} else {
			//return res.status(200).send(user.generateToken())
			console.log(user)
			token=user.generateToken()
			console.log(token)
			return res.send({user, token})

		}
	  }).catch(function(error) {
		return res.status(401).send({ error: error })
	  })
}

// POST - Logout de usuario
const logout = function(req, res){
	return res.status(200).send({result: true})
	/*
	req.user.authToken = req.user.authToken.filter(function(token) {
		return token.token !== req.token
	})
	req.user.save().then(function() {
		return res.send()
	}).catch(function(error) {
		return res.status(500).send({ error: error })
	})
	*/
}

//CHECAR COMO SE HACE ESTO, QUE ENCUENTRE LOS RESULTADOS SIMILIARES, NO TAL CUALES
//Hice lo de regex, a ver qué tal sale
// GET - Consulta de usuarios por nombre de usuario
const findUsers = function(req, res) {
	User.find({ name: new RegExp(req.body.name, 'i'), status:'Enable' }).exec(function(error, users) {
		return res.send(users)
	}).catch(function(error){
		res.status(500).send(error)
	})
}

// GET - Consulta de usuario por id del mismo
const findAuthor = function(req, res) {
	const _id = req.params.id
	User.findById({ _id, status:'Enable' }).exec(function(error, user) {
			info={
				name:user.name,
				typee: user.typee,
				email: user.email,
				about: user.about
			}
			return res.send(info)
	})
}

// GET - Consulta de usuarios
const getAllUsers = function(req, res) {
	console.log(req.user)
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
	console.log('disableUser', req.user)
	const _id=req.user._id
	User.findByIdAndUpdate(_id, { status: 'Disable' }).then( function(user) {
		if(!user) {
			return res.status(404).send()
		}
		return res.send(user.id)
	}).catch(function(error) {
		res.status(500).send(error)
	})
	// Después de hacer disableUser, lo hacemos logout, para que no pueda seguir haciendo las cosas de un usuario habilitado
	//logout()
}

module.exports = {
	createUser : createUser,
	login : login,
	logout : logout,
	findUsers : findUsers,
	getAllUsers : getAllUsers,
	updateUser : updateUser,
	disableUser : disableUser,
	findAuthor : findAuthor
}
