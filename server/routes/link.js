const express = require("express")
const router = express.Router();

// Import middleware
const { requireSignIn, authMiddleware } = require('../controllers/auth.js')

// Import controllers
const { list, read, create, update, remove } = require('../controllers/link.js')

// Import validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link.js')
const { runValidation } = require('../validators/index.js')

// Routes
router.get('/links', list)
router.get('/link/:slug', read)
router.post('/link', linkCreateValidator, runValidation, requireSignIn, authMiddleware, create)
router.put('/link/:slug', linkUpdateValidator, runValidation, requireSignIn, authMiddleware, update)
router.delete('/link/:slug', requireSignIn, authMiddleware, remove)

module.exports = router;