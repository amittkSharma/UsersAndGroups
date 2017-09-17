'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../logger");
var GetDbCollection = /** @class */ (function () {
    function GetDbCollection() {
    }
    GetDbCollection.prototype.getDbCollectionFrmDbName = function (req, collectionName) {
        var dbName = req.db.databaseName;
        logger_1.log.info('querying database', dbName);
        return req.db.db(dbName).collection(collectionName);
    };
    return GetDbCollection;
}());
exports.getDbCollection = new GetDbCollection();
//# sourceMappingURL=getDbCollection.js.map