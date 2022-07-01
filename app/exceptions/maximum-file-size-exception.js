const BaseException = require('./base-exception')

class MaximumFileSizeException extends BaseException {
    constructor(size) {
        super(`Maximum upload file size: ${size}MB`, 400)
    }
}

module.exports = MaximumFileSizeException