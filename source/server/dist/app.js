"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var compression = require("compression");
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");
var api_1 = require("./api/api");
var connectToMongo_1 = require("./connectToMongo");
var config_1 = require("./config");
var prepopulateMongo_1 = require("./prepopulateMongo");
exports.app = express();
exports.app.set('json replacer', function (key, value) { return value; });
if (process.env['NODE_ENV'] !== 'production') {
    exports.app.set('json spaces', 2);
}
exports.app.use(cors());
exports.app.use(compression());
exports.app.use(bodyParser.json());
exports.app.use('/api', connectToMongo_1.connectMongo.connectToMongo(config_1.config.userGroupsDataDb), api_1.api);
exports.app.use(express.static(path.join(__dirname, 'public')));
exports.app.all('/*', function (req, res) { return res.sendFile(__dirname + '/public/index.html'); });
prepopulateMongo_1.prePopulateMongo.prePopulateDbWithCollections(config_1.config.userGroupsDataDb, config_1.config.tableNames, config_1.config.dataTables.groupTypes);
//# sourceMappingURL=app.js.map