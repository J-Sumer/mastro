const { check, body, validationResult } = require('express-validator');

exports.categoryValidator = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('image').not().isEmpty().withMessage('Image is required'),
    check('content').not().isEmpty().withMessage('Content is required')
]

exports.categoryUpdateValidator = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('content').not().isEmpty().withMessage('Content is required')
]
