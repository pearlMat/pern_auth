const express = require('express');

class Server {
  constructor(port) {
    this.port = port;
    this.app = express();
  }

  start() {
    this._listen();
  }
  _listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on ${this.port}`);
    });
  }
}

module.exports = Server;
