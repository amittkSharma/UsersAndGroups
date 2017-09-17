'use strict'
import { log } from './logger'
import * as MongoDB from 'mongodb'
const MongoClient = MongoDB.MongoClient

const GroupTypes = [
  {name: 'Cricket Club',  groupId: 'grpType_1', icon: 'games',  shortName: 'cc'},
  {name: 'Football Club', groupId: 'grpType_2', icon: 'games', shortName: 'fc'},
  {name: 'Olympic Squad', groupId: 'grpType_3', icon: 'games', shortName: 'os'},
  {name: 'Computer Science', groupId: 'grpType_4', icon: 'school', shortName: 'cs'},
  {name: 'MEAN stack', groupId: 'grpType_5', icon: 'web_asset', shortName: 'MEAN'},
  {name: 'Travellers', groupId: 'grpType_6', icon: 'card_travel', shortName: 'travel'},
]

class PrePopulateMongoDb {

  prePopulateDbWithCollections(connectionUrl: string, names: string[], groupTypeTableName: string) {
    MongoClient.connect(connectionUrl).then(database => {
      console.log(`Connected successfully to: ${connectionUrl}`)
      database.dropDatabase()

      names.forEach(name => {
        console.log(`pre populating databse ${name}`)

        if (name === groupTypeTableName) {
          const collection = database.collection(name)
          collection.insert(GroupTypes)
        }
        else {
          database.createCollection(name, { size: 2147483648 })
        }
      })
    })
  }
}

export const prePopulateMongo = new PrePopulateMongoDb()
