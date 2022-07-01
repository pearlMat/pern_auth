const AuthController = require('../../app/controllers/api/auth-controller')
const { validate } = require('../../app/middleware/validate')
const ValidationRules = require('../../app/validators/auth')

module.exports = {
    group: {
        prefix: '/auth'
    },
    routes: [
        {
            method: 'post',
            path: '/login',
            middleware: [ValidationRules.login, validate],
            handler: AuthController.login.bind(AuthController)
        },
        {
            method: 'post',
            path: '/register',
            middleware: [ValidationRules.register, validate],
            handler: AuthController.register.bind(AuthController)
        }
    ]
}