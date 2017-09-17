"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger_1 = require("../logger");
var getDbCollection_1 = require("./getDbCollection");
var config_1 = require("../config");
var uniqueId = require("uuid");
exports.api = express.Router();
exports.api.get('/users', getAllUsers);
exports.api.get('/groups', getAllGroups);
exports.api.get('/groupTypes', getAllGroupTypes);
exports.api.post('/newGroup', createNewGroup);
exports.api.post('/newUser', createNewUser);
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
    logger_1.log.info("creating a new group..");
    var newGrpInfo = req.body.data;
    var id = uniqueId();
    logger_1.log.info("creating new group with name: " + newGrpInfo.name + " and id: " + id);
    var grp = __assign({}, newGrpInfo, { id: id });
    var col = getDbCollection_1.getDbCollection.getDbCollectionFrmDbName(req, config_1.config.dataTables.groups);
    col.insert(grp);
    res.json(grp);
}
function createNewUser(req, res) {
    logger_1.log.info("creating a new user..");
    var newGrpInfo = req.body.data;
    var id = uniqueId();
    var creationDate = new Date().toISOString();
    logger_1.log.info("creating new user with name: " + newGrpInfo.name + " and id: " + id + " on date : " + creationDate);
    var grp = __assign({}, newGrpInfo, { id: id, startDate: creationDate });
    var col = getDbCollection_1.getDbCollection.getDbCollectionFrmDbName(req, config_1.config.dataTables.users);
    col.insert(grp);
    var grpCol = getDbCollection_1.getDbCollection.getDbCollectionFrmDbName(req, config_1.config.dataTables.groups);
    newGrpInfo.memberOf.map(function (mem) {
        var membershipDetails = {
            membershipId: mem.membershipId,
            joiningDate: creationDate,
            duration: { value: 1, unit: 'year' },
            designation: 'Member',
            isMembershipCancelled: false,
        };
        grpCol.update({ id: mem.groupId }, { $push: { members: membershipDetails } });
    });
    res.json(grp);
}
//# sourceMappingURL=api.js.map