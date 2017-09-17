"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var config_1 = require("./config");
var logger_1 = require("./logger");
var http = require("http");
process.on('unhandledRejection', function (reason, p) {
    logger_1.log.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
    // application specific logging, throwing an error, or other logic here
});
var server = http.createServer(app_1.app);
server.listen(config_1.config.serverPort, function () {
    logger_1.log.info('Starting server at port ' + config_1.config.serverPort);
});
//# sourceMappingURL=index.js.map