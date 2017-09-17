import * as bunyan from 'bunyan'

export const log = bunyan.createLogger({
  name: 'server',
})

// disable logging in unit tests
if (process.env.NODE_ENV === 'test') {
  log.level('fatal')
}
