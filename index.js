/*jslint node:true*/
/*globals CONFIG*/
'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var format  = require('util').format;
var boot    = require('./bootstrap/');
var routes  = require('./routes.js');
var server  = express();

/**
 * Init third-party services
 */
boot.mongo();
boot.environment();
boot.newrelic();

/**
 * Express Configuration.
 */
if (!process.env.DISABLE_EXPRESS_LOG) {
    server.use(express.logger('dev'));
}
server.set('port', CONFIG.port);
server.disable('x-powered-by');
server.use(express.logger('dev'));
server.use(express.favicon());
server.use(express.urlencoded());
server.use(express.json());
server.use(express.methodOverride());
server.use(server.router);

/**
 * Routes Configuration.
 */
routes(server);

/**
 * Start Server.
 */
server.listen(server.get('port'), function () {
    var msg = '';
    msg += '\n- \u001b[31mServeJob - API';
    msg += '\u001b[31m at \u001b[0m';
    msg += 'http://localhost:%s\u001b[0m';
    msg = format(msg, server.get('port'));
    console.info(msg);
});
