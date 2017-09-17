"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bunyan = require("bunyan");
exports.log = bunyan.createLogger({
    name: 'server',
});
// disable logging in unit tests
if (process.env.NODE_ENV === 'test') {
    exports.log.level('fatal');
}
//# sourceMappingURL=logger.js.map