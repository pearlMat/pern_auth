const express = require('express')

const apiRoutes = require('./api')
const appConfig = require('../config/app')
const BaseException = require('../app/exceptions/base-exception')
const path = require('path')

class Router {
    constructor() {
        this.router = express.Router()
       
        this.apiRoutes = apiRoutes
    }

    create(app) {
        this._attachMiddleware()
       
        this._attachApiRoutes()
        this._handlePageNotFound()
       // this._handleExceptions()

        app.use(this.router)
    }

    _handleExceptions() {
        this.router.use((err, req, res, next) => {
            err.statusCode = err.status || err.statusCode || 500
          //  logger.error(err)

            const expectJson = /application\/json/.test(req.get('accept'))

            if (appConfig.appEnv === 'production' && !(err instanceof BaseException)) {
                if (expectJson) {
                    return res.status(err.statusCode).send(errorResponse(err.statusCode, 'Something went wrong!'))
                }

                const page = getErrorPage(err.statusCode)

                return res.render(`errors/${page}-page`, { message: 'Someting went wrong!' })
            }

            if (expectJson) {
                return res.status(err.statusCode).send({
                    message: err.message,
                    status: err.statusCode
                })
            }

            const page = getErrorPage(err.statusCode)

            res.render(`errors/${page}-page`, { message: err.message || 'Something went wrong!' })
        })
    }

    _catchError(route) {
        return (req, res, next) => {
            route(req, res, next).catch(next)
        }
    }

    _attachMiddleware() {
        this.router.use(express.json())
       // this.router.use(express.static(path.join(__dirname, '../public')))
    }

    _handlePageNotFound() {
        this.router.all('*', (req, res) => {
            res.status(404).send('Page not found!')
        })
    }

    _attachWebRoutes() {
        this._attachRoutes(this.webRoutes)
    }

    _attachApiRoutes() {
        this._attachRoutes(this.apiRoutes, '/api')
    }

    _attachRoutes(routeGroups, prefix = '') {
        routeGroups.forEach(({ group, routes }) => {
            routes.forEach(({ method, path, middleware = [], handler }) => {
                this.router[method](
                    prefix + group.prefix + path,
                    [...group.middleware || [], ...middleware],
                    this._catchError(handler))
            })
        })
    }
}

const errorResponse = (status, message) => {
    return {
        message,
        status
    }
}

const getErrorPage = status => {
    let page = ''

    switch (status) {
        case 404:
            page = 404
            break
        case 422:
            page = 400
            break
        case 403:
            page = 400
            break
        case 401:
            page = 400
            break
        default:
            page = 500
            break
    }

    return page
}

module.exports = new Router()