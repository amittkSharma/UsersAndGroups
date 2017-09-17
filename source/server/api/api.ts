import * as express from 'express'
import { log } from '../logger'
import { getDbCollection } from './getDbCollection'
import { config } from '../config'

import * as treeify from 'treeify'
import * as uniqueId from 'uuid'

export const api = express.Router()
api.get('/users', getAllUsers)
api.get('/groups', getAllGroups)
api.get('/groupTypes', getAllGroupTypes)
api.post('/newGroup', createNewGroup)
api.post('/newUser', createNewUser)

function getAllGroupTypes(req, res) {
  log.info('getting all group types')
  const col = getDbCollection.getDbCollectionFrmDbName(req, config.dataTables.groupTypes)

  col.find().toArray().then(docs => {
    if (docs) {
      res.json(docs)
    }
  })
  .catch(err => {
    req.log.error(err)
    res.status(500).json({ message: 'internal server error' })
  })
}

function getAllUsers(req, res) {
  log.info('getting all users')
  const col = getDbCollection.getDbCollectionFrmDbName(req, config.dataTables.users)

  col.find().toArray().then(docs => {
    if (docs) {
      res.json(docs)
    }
  })
  .catch(err => {
    req.log.error(err)
    res.status(500).json({ message: 'internal server error' })
  })
}

function getAllGroups(req, res) {
  log.info('getting all groups')
  const col = getDbCollection.getDbCollectionFrmDbName(req, config.dataTables.groups)

  col.find().toArray().then(docs => {
    if (docs) {
      res.json(docs)
    }
  })
  .catch(err => {
    req.log.error(err)
    res.status(500).json({ message: 'internal server error' })
  })
}

function createNewGroup(req, res) {
  log.info(`creating a new group..`)
  const newGrpInfo = req.body.data
  const id = uniqueId()
  log.info(`creating new group with name: ${newGrpInfo.name} and id: ${id}`)
  const grp = {
    ...newGrpInfo,
    id,
  }
  const col = getDbCollection.getDbCollectionFrmDbName(req, config.dataTables.groups)
  col.insert(grp)

  res.json(grp)
}

function createNewUser(req, res) {
  log.info(`creating a new user..`)
  const newGrpInfo = req.body.data
  const id = uniqueId()
  const creationDate = new Date().toISOString()
  log.info(`creating new user with name: ${newGrpInfo.name} and id: ${id} on date : ${creationDate}`)
  const grp = {
    ...newGrpInfo,
    id,
    startDate: creationDate,
  }
  const col = getDbCollection.getDbCollectionFrmDbName(req, config.dataTables.users)
  col.insert(grp)

  const grpCol = getDbCollection.getDbCollectionFrmDbName(req, config.dataTables.groups)

  newGrpInfo.memberOf.map(mem => {
    const membershipDetails = {
      membershipId: mem.membershipId,
      joiningDate: creationDate,
      duration: {value: 1, unit: 'year'},
      designation: 'Member',
      isMembershipCancelled: false,
    }
    grpCol.update(
      { id: mem.groupId },
      { $push: { members:  membershipDetails } },
    )
  })

  res.json(grp)
}
