'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../logger");
var CreateCollection = /** @class */ (function () {
    function CreateCollection() {
    }
    CreateCollection.prototype.prePopulatingMongoDb = function () {
        logger_1.log.info('AMIT');
    };
    return CreateCollection;
}());
exports.prePopulateMongo = new CreateCollection();
//# sourceMappingURL=createCollection.js.map