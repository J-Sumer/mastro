const { check, body, validationResult } = require('express-validator');

exports.linkCreateValidator = [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('url').not().isEmpty().withMessage('Url is required'),
    check('categories').not().isEmpty().withMessage('Pick a category')
]

exports.linkUpdateValidator = [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('url').not().isEmpty().withMessage('Url is required'),
    check('categories').not().isEmpty().withMessage('Pick a category')
]
