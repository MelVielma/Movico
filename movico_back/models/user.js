const mongoose = require('mongoose')
const validator = require('validator')

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
	authToken: [{
		token: {
			type: String,
			required: true
		}
	}]
},
{
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
})

userSchema.methods.toJSON = function() {
	const user = this
	const userObject = user.toObject()

	delete userObject.password
	delete userObject.tokens

	return userObject
}

userSchema.statics.findByCrendentials = function(email, password) {
	return new Promise( function(resolve, reject) {
		User.findOne({email}).then(function(user) {
			if ( !user ) {
				return reject('User does not exist')
			}
			bcrypt.hash(password, 8).then(function(hash) {
				passwordHash = hash
				console.log(passwordHash)
			})
			console.log(user.password)
			bcrypt.compare(password, user.password).then(function (match) {
				if (match) {
					return resolve(user)
				} else {
					return reject('Password does not match!')
				}
			}).catch(function(error) {
				return reject('USer or password does not match!')
			})

		})
	})
}

userSchema.methods
