"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger_1 = require("../logger");
var getDbCollection_1 = require("./getDbCollection");
var config_1 = require("../config");
exports.api = express.Router();
exports.api.get('/users', getAllUsers);
exports.api.get('/groups', getAllGroups);
exports.api.get('/groupTypes', getAllGroupTypes);
exports.api.get('/newGroup', createNewGroup);
function getAllGroupTypes(req, res) {
    logger_1.log.info('getting all group types');
    var col = getDbCollection_1.getDbCollection.getDbCollectionFrmDbName(req, config_1.config.dataTables.groupTypes);
    col.find().toArray().then(function (docs) {
        if (docs) {
            res.json(docs);
        }
    })
        .catch(function (err) {
        req.log.error(err);
        res.status(500).json({ message: 'internal server error' });
    });
}
function getAllUsers(req, res) {
    logger_1.log.info('getting all users');
    var col = getDbCollection_1.getDbCollection.getDbCollectionFrmDbName(req, config_1.config.dataTables.users);
    col.find().toArray().then(function (docs) {
        if (docs) {
            res.json(docs);
        }
    })
        .catch(function (err) {
        req.log.error(err);
        res.status(500).json({ message: 'internal server error' });
    });
}
function getAllGroups(req, res) {
    logger_1.log.info('getting all groups');
    var col = getDbCollection_1.getDbCollection.getDbCollectionFrmDbName(req, config_1.config.dataTables.groups);
    col.find().toArray().then(function (docs) {
        if (docs) {
            res.json(docs);
        }
    })
        .catch(function (err) {
        req.log.error(err);
        res.status(500).json({ message: 'internal server error' });
    });
}
function createNewGroup(req, res) {
    logger_1.log.info('creating a new group', req.body);
    // const col = getDbCollection.getDbCollectionFrmDbName(req, config.dataTables.groups)
    var col = getDbCollection_1.getDbCollection.getDbCollectionFrmDbName(req, config_1.config.dataTables.groups);
    col.find().toArray().then(function (docs) {
        if (docs) {
            res.json(docs);
        }
    })
        .catch(function (err) {
        req.log.error(err);
        res.status(500).json({ message: 'internal server error' });
    });
}
//# sourceMappingURL=api.js.map