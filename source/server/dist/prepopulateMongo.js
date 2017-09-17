'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var MongoDB = require("mongodb");
var MongoClient = MongoDB.MongoClient;
var GroupTypes = [
    { name: 'Cricket Club', groupId: 'grpType_1', icon: 'games', shortName: 'cc' },
    { name: 'Football Club', groupId: 'grpType_2', icon: 'games', shortName: 'fc' },
    { name: 'Olympic Squad', groupId: 'grpType_3', icon: 'games', shortName: 'os' },
    { name: 'Computer Science', groupId: 'grpType_4', icon: 'school', shortName: 'cs' },
    { name: 'MEAN stack', groupId: 'grpType_5', icon: 'web_asset', shortName: 'MEAN' },
    { name: 'Travellers', groupId: 'grpType_6', icon: 'card_travel', shortName: 'travel' },
];
var PrePopulateMongoDb = /** @class */ (function () {
    function PrePopulateMongoDb() {
    }
    PrePopulateMongoDb.prototype.prePopulateDbWithCollections = function (connectionUrl, names, groupTypeTableName) {
        MongoClient.connect(connectionUrl).then(function (database) {
            console.log("Connected successfully to: " + connectionUrl);
            database.dropDatabase();
            names.forEach(function (name) {
                console.log("pre populating databse " + name);
                if (name === groupTypeTableName) {
                    var collection = database.collection(name);
                    collection.insert(GroupTypes);
                }
                else {
                    database.createCollection(name, { size: 2147483648 });
                }
            });
        });
    };
    return PrePopulateMongoDb;
}());
exports.prePopulateMongo = new PrePopulateMongoDb();
//# sourceMappingURL=prepopulateMongo.js.map