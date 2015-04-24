var amqp = require('amqplib');
var when = require('when');
var config = require('../../../config');
var routingKey = 'sharepear.picture.new';
var exchange = 'sharepear';

var publish = function(filePath){
    var message = JSON.stringify({
        filePath: filePath
    });

    amqp.connect(config.rabbitmq.url).then(function (conn) {
        return conn.createChannel().then(function (channel) {
            var ok = when.all([
                channel.assertQueue(routingKey, {durable: config.rabbitmq.durable}),
                channel.assertExchange(exchange, 'direct', {durable: config.rabbitmq.durable}),
                channel.bindQueue(routingKey, exchange, routingKey),
                channel.publish(exchange, routingKey, new Buffer(message), {
                    persistent: config.rabbitmq.persistent,
                    contentType: 'application/json'
                }),
                console.log('[sharepear] sent "' + message + '" to routing key ' + routingKey),
            ]);
            ok.then(function (_qok) {
                return channel.close();
            }).ensure(function () {
                conn.close();
            });
        });
    }).then(null, console.warn);
};

module.exports = {
    publish : publish
};
