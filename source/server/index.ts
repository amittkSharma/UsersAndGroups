import { app } from './app'
import { config } from './config'
import { log } from './logger'
import * as http from 'http'

process.on('unhandledRejection', (reason, p) => {
    log.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
    // application specific logging, throwing an error, or other logic here
})
const server = http.createServer(app)
server.listen(config.serverPort, () => {
  log.info('Starting server at port ' + config.serverPort)
})
