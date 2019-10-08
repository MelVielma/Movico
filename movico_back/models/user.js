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
				return reject('User or password does not match!')
			})

		})
	})
}

userSchema.methods.generateToken = function() {
	const user = this
	if (process.env.NODE_ENV === 'production') {
		var SECRET = process.env.SECRET
	}
	else
	{
		const config = require('../misc.js')
		var SECRET = config.secret
	}
	const token = jwt.sign({ _id: user._id.toString() },  SECRET, {expiresIn: '7 days'})
	user.tokens = user.tokens.concat({ token })
	return new Promise(function(resolve, reject) {
		user.save().then(function(user) {
			return resolce(token)
		}).catch(function(error) {
			return reject(error)
		})
	})
}

// Esto debería de ser para poder hacer el update a las passwords.
// CHECAR SI JALA O NO

userSchema.pre('save', function(next) {
  const user = this
  console.log("ando en el método pre de save")
  
  if( user.isModified('password') ) {
  	console.log("Si se modificó la password")
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