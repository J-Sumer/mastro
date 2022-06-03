const { check, body, validationResult } = require('express-validator');

exports.userRegisterValidator = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Must be a valid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password length should be greater than 6 characters')
]

exports.userLoginValidator = [
    check('email').isEmail().withMessage('Must be a valid email address')
]