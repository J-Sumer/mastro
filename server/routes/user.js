const express = require("express")
const router = express.Router();

// Import middleware
const { requireSignIn, authMiddleware, adminMiddleware } = require('../controllers/auth.js')

// Import controllers
const { read } = require('../controllers/user.js')

// Routes
router.get('/user', requireSignIn, authMiddleware, read)
router.get('/admin', requireSignIn, adminMiddleware, read)

module.exports = router