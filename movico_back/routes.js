const express = require('express')
const cors = require('cors');
const router = express.Router()
router.all('*',cors())
const users = require('./controllers/users.js')
const comments = require('./controllers/comments.js')
const publications = require('./controllers/publications.js')
const auth = require('./middleware/auth.js')

/*
router.post('/users', users.createUser)  // signup
router.patch('/users', auth.auth, users.updateUser)

router.post('/comments/:id', auth.auth, comments.createComment)
router.delete('/comments/:id', auth.auth, comments.deleteComment)
*/
//Rutas de user 
router.get('/users', auth.auth, users.getAllUsers)
router.get('/users/:id', auth.auth, users.findAuthor)
router.post('/users/login', users.login)
router.post('/users/logout', auth.auth, users.logout)
router.post('/users', users.createUser) 
router.patch('/users/disable', auth.auth, users.disableUser)

router.get('/publications',auth.auth, publications.getAllPublications)
router.get('/publications/:id',auth.auth, publications.getSinglePublication)
router.post('/publications/:id', auth.auth, publications.enablePublication)
router.post('/publications', auth.auth, publications.createPublication)
router.patch('/publications/:id',  auth.auth, publications.updatePublication)
router.delete('/publications/:id', auth.auth, publications.deletePublication)

router.post('/comments/:id', auth.auth, comments.createComment)
router.delete('/comments/:id', auth.auth, comments.deleteComment)

router.get('*', function(req, res) {
  res.send({
    error: 'This route does not exist, try /users/login'
  })
})

module.exports = router