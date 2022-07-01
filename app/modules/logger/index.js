const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')
const { format } = winston
const { combine, timestamp, prettyPrint, errors } = format

const fs = require('fs')
const util = require('util')
const path = require('path')
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

const transport = new DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    dirname: 'logs'
})

const logger = winston.createLogger({
    format: combine(
        errors({ stack: true }),
        timestamp(),
        prettyPrint(),
        format.json()
    ),
    json: true,
    transports: [
        transport
    ]
})

logger.getLogDates = async () => {
    const destination = path.join(__dirname, '../../../logs')
    const files = await readdir(destination, { withFileTypes: true })

    console.log(files)

    return files
        .filter(file => !file.isDirectory() && file.name !== '.gitignore')
        .map(file => file.name.split('.')[2])
}

logger.getLogByDate = async date => {

    const destination = path.join(__dirname, `../../../logs/winston.log.${date}`)
    const file = await readFile(destination, 'utf8')
    const logs = file.split('\n')
    const parsedLogs = []
    const logLevels = {}

    for (const log of logs) {
        try {

            const parsedLog = JSON.parse(log)

            if (logLevels.hasOwnProperty(parsedLog.level)) {
                logLevels[parsedLog.level]++
            } else {
                logLevels[parsedLog.level] = 1
            }

            parsedLogs.push(parsedLog)
        } catch (e) { }
    }

    return {
        date,
        total: parsedLogs.length,
        logLevels,
        logs: parsedLogs
    }
}

module.exports = logger