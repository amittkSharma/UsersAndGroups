import * as express from 'express'
import * as compression from 'compression'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as path from 'path'
import { api } from './api/api'
import { connectMongo } from './connectToMongo'
import { config } from './config'
import { prePopulateMongo } from './prepopulateMongo'

export const app = express()
app.set('json replacer', (key, value) => value)
if (process.env['NODE_ENV'] !== 'production') {
  app.set('json spaces', 2)
}

app.use(cors())
app.use(compression())
app.use(bodyParser.json())

app.use('/api', connectMongo.connectToMongo(config.userGroupsDataDb) , api)
app.use(express.static(path.join(__dirname, 'public')))
app.all('/*', (req, res) => res.sendFile(__dirname + '/public/index.html'))
prePopulateMongo.prePopulateDbWithCollections(config.userGroupsDataDb,
                                              config.tableNames,
                                              config.dataTables.groupTypes)
