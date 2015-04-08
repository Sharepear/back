var restify = require('restify');
var toobusy = require('toobusy');

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
    uploadDir: 'upload'
}));
server.use(restify.queryParser());
server.use(restify.fullResponse());
server.use(restify.gzipResponse());

/**
 * route
 */
server.post('/upload', function(req, res, next) {
    var filename = req.files.file.path;
    res.send({name: filename});
    next();
});

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
