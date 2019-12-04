const jwt = require('jsonwebtoken')

const User = require('../models/user')

if(process.env.NODE_ENV==='production'){
  var sec = process.env.secret
}
else{
  const credentials = require('../config.js')
  var sec = credentials.secret
}


const auth = function( req, res, next ) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, sec)
    User.findOne({ _id: decoded._id, 'authToken.token': token }).then(function(user) {
      if(!user) {
        throw new Error()
      }
      req.token = token
      req.user = user
      next()
    }).catch(function(error) {
      req.user = undefined
    next()
    })
  } catch(e) {
    req.user = undefined
    next()
  }
}

const auth2 = function( req, res, next ) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, sec)
    User.findOne({ _id: decoded._id}).then(function(user) {
      if(!user) {
        throw new Error()
      }
      req.token = token
      req.user = user
      next()
    }).catch(function(error) {
      next()
    })
  } catch(e) {
    req.user = undefined
    next()
  }
}
module.exports = {auth:auth,
auth2:auth2}
