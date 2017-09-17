'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var MongoDB = require("mongodb");
var MongoClient = MongoDB.MongoClient;
var MongoConnect = /** @class */ (function () {
    function MongoConnect() {
    }
    MongoConnect.prototype.connectToMongo = function (serverUrl) {
        var connection = MongoClient.connect(serverUrl).then(function (database) {
            console.log('Connected successfully to: ', serverUrl);
            return database;
        });
        return function (req, res, next) {
            connection.then(function (database) {
                req.db = database;
                next();
            })
                .catch(function (err) {
                console.log(err);
                res.status(500).json({ message: 'database error' });
            });
        };
    };
    return MongoConnect;
}());
exports.connectMongo = new MongoConnect();
//# sourceMappingURL=connectToMongo.js.map