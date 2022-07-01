const Server = require('./server')

const port = 8080

const app = new Server(port)
app.start()