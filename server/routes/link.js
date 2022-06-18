const express = require("express")
const router = express.Router();

// Import middleware
const { requireSignIn, authMiddleware } = require('../controllers/auth.js')

// Import controllers
const { list, read, create, update, remove, clickCount } = require('../controllers/link.js')

// Import validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link.js')
const { runValidation } = require('../validators/index.js')

// Routes
router.get('/links', list)
router.get('/link/:_id', read)
router.put('/click-count', clickCount)
router.post('/link', linkCreateValidator, runValidation, requireSignIn, authMiddleware, create)
router.put('/link/:_id', linkUpdateValidator, runValidation, requireSignIn, authMiddleware, update)
router.delete('/link/:_id', requireSignIn, authMiddleware, remove)

module.exports = router;