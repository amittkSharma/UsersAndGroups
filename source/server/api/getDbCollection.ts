'use strict'
import { log } from '../logger'

class GetDbCollection {

  getDbCollectionFrmDbName(req, collectionName) {
    const dbName = req.db.databaseName
    log.info('querying database', dbName)
    return req.db.db(dbName).collection(collectionName)
  }
}

export const getDbCollection = new GetDbCollection()
