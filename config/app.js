require('dotenv').config()

module.exports = {
    appKey: process.env.APP_KEY,
    appEnv: process.env.NODE_ENV,
    appUrl: process.env.APP_URL,
    appPort: process.env.APP_PORT,
    tokenExpiresIn: 3600
}