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


router.get('/products/:id', auth.auth, products.getProduct)
router.get('/products', auth.auth, products.getProducts)
router.post('/products', auth.auth, products.createProduct)
router.patch('/products/:id', auth.auth, products.updateProduct)
router.delete('/products/:id', auth.auth, products.deleteProduct)

router.post('/comments/:id', auth.auth, comments.createComment)
router.delete('/comments/:id', auth.auth, comments.deleteComment)
*/
//Rutas de user
router.get('/users', auth.auth2, users.getAllUsers)
router.get('/users/:id', auth.auth, users.findAuthor)
router.post('/users/login', users.login)
router.post('/users/logout', auth.auth, users.logout)
router.post('/users', users.createUser)
router.patch('/users/disable', auth.auth2, users.disableUser)
router.patch('/users/update', auth.auth2, users.updateUser)

router.get('/publications', auth.auth2,publications.getAllPublications)
router.get('/publications/:id', auth.auth2,publications.getSinglePublication)
router.get('/publicationsByUser/:userId', auth.auth, publications.getByUserId)
router.get('/publicationsByTag/:tag', auth.auth, publications.getByTag)
router.get('/publicationsByMultiTags/:tags', auth.auth, publications.getByTags)
router.post('/publications', auth.auth, publications.createPublication)
router.post('/publications/:id', auth.auth, publications.enablePublication)



router.patch('/publications/:id',  auth.auth2, publications.updatePublication)
router.delete('/publications/:id', auth.auth2, publications.deletePublication)

router.post('/comments/:id', auth.auth, comments.createComment)
router.delete('/comments/:id', auth.auth, comments.deleteComment)

router.get('*', function(req, res) {
  res.send({
    error: 'This route does not exist, try /users/login'
  })
})

module.exports = router
