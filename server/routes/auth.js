const express = require("express")
const router = express.Router();

// Import controllers
const { register, registerActivate, login, requireSignIn } = require('../controllers/auth.js')

// Import validators
const { userRegisterValidator, userLoginValidator } = require('../validators/auth.js')
const { runValidation } = require('../validators/index.js')

router.post('/register', userRegisterValidator, runValidation, register)
router.post('/register/activate', registerActivate)
router.post('/login', userLoginValidator, runValidation, login)

module.exports = router