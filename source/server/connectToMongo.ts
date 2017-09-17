'use strict'

import * as MongoDB from 'mongodb'
const MongoClient = MongoDB.MongoClient

class MongoConnect {

  connectToMongo(serverUrl) {
    const connection = MongoClient.connect(serverUrl).then(database => {
      console.log('Connected successfully to: ', serverUrl)
      return database
    })
    return (req, res, next) => {
      connection.then(database => {
        req.db = database
        next()
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: 'database error' })
      })
    }
  }
}

export const connectMongo = new MongoConnect()
