const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
if(process.env.NODE_ENV==='production'){
  var sec = process.env.secret
}
else{
  const credentials = require('../config.js')
  var sec = credentials.secret
}

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate(value) {
			if(!validator.isEmail(value)) {
				throw new Error('Invalid email address')
			}
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		trim: true
	},
	about: {
		type: String
	},
	status: {
		type: String
	},
	/*
	authToken: [{
		token: {
			type: String,
			required: true
		}
	}],
	*/
	typee:{
		type:String,
		required: true,
		default:"userOnly",
		validate(value) {
		  if ( !validator.equals(value,"userOnly")&& !validator.equals(value,"admin")) {
			throw new Error('Rol inválido')
		  }
		}
	}
},
{
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
})

userSchema.virtual('publications', {
	ref: 'Publication',
	localField: '_id',
	foreignField: 'author'
  })

userSchema.methods.toJSON = function() {
	const user = this
	const userObject = user.toObject()

	delete userObject.password
	//delete userObject.authToken

	return userObject
}

userSchema.statics.findByCredentials = function(email, password) {
	return new Promise( function(resolve, reject) {
		User.findOne({ email }).then(function(user) {
		  if( !user ) {
			return reject('User does not exist')
		  }
		  bcrypt.compare(password, user.password).then(function(match) {
			if(match) {
			  return resolve(user)
			} else {
			  return reject('Wrong password!')
			}
		  }).catch( function(error) {
			return reject('Wrong password!')
		  })
		})
	  })
}

userSchema.methods.generateToken = function() {
	
	
	
		const user = this
		const token = jwt.sign({ _id: user._id.toString() }, sec, { expiresIn: '7 days'})
		console.log(token)
		return  (token)
	
}

// Esto debería de ser para poder hacer el update a las passwords.
// CHECAR SI JALA O NO

userSchema.pre('save', function(next) {
	const user = this
	if( user.isModified('password') ) {
	  bcrypt.hash(user.password, 8).then(function(hash){
		user.password = hash
		next()
	  }).catch(function(error){
		return next(error)
	  })
	} else {
	  next()  
	}
})

const User = mongoose.model('User', userSchema)

module.exports = User