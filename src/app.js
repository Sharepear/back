var restify = require('restify');
var toobusy = require('toobusy');
var config = require('../config');
var pictureNew = require("./rabbitmq/publishers/pictureNew");

var _check_if_busy = function(req, res, next) {
    if (toobusy()) {
        return res.send(503, "I'm busy right now, sorry.");
    } else {
        return next();
    }
};

/**
 * server configuration
 */
var server = restify.createServer();
restify.CORS.ALLOW_HEADERS.push('cache-control');
restify.CORS.ALLOW_HEADERS.push('x-requested-with');
server.use(restify.CORS());
server.pre(restify.CORS());
server.pre(restify.pre.userAgentConnection());
server.use(_check_if_busy);
server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser({
    uploadDir: 'upload',
    mapParams: false,
    keepExtensions: true
}));
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.fullResponse());
server.use(restify.gzipResponse());

/**
 * route
 */
server.post(config.sharepear.uploadPath, function(req, res, next) {
    var filePath = req.files.file.path;
    pictureNew.publish(filePath);
    res.send({name: filePath});
    next();
});

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

//restifyOAuth2.ropc(server, options);
