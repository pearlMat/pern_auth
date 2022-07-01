const { body } = require('express-validator')

module.exports = (() => {
    return [
        body('firstName')
            .notEmpty()
            .withMessage('First name cannot be empty!'),

        body('lastName')
            .notEmpty()
            .withMessage('Last name cannot be empty!'),

        body('email')
            .isEmail()
            .withMessage('Email needs to be a valid address!'),

        body('password')
            .notEmpty()
            .withMessage('Password cannot be empty!')
    ]
})()