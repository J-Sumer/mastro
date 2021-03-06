const express = require("express")
const router = express.Router();

// Import middleware
const { requireSignIn, adminMiddleware } = require('../controllers/auth.js')

// Import controllers
const { list, read, create, update, remove } = require('../controllers/category.js')

// Import validators
const { categoryValidator, categoryUpdateValidator } = require('../validators/category.js')
const { runValidation } = require('../validators/index.js')

// Routes
router.get('/categories', list)
// This is a post req instead of get. Since we need limit and skip
router.post('/category/:slug', read)
router.post('/category', categoryValidator, runValidation, requireSignIn, adminMiddleware, create)
router.put('/category/:slug', categoryUpdateValidator, runValidation, requireSignIn, adminMiddleware, update)
router.delete('/category/:slug', requireSignIn, adminMiddleware, remove)

module.exports = router;