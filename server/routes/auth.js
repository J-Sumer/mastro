const express = require("express")
const router = express.Router();

// Import controllers
const { register, registerActivate } = require('../controllers/auth.js')

// Import validators
const { userRegisterValidator } = require('../validators/auth.js')
const { runValidation } = require('../validators/index.js')

router.post('/register', userRegisterValidator, runValidation, register)
router.post('/register/activate', registerActivate)

module.exports = router