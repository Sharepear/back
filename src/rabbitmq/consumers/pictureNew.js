var amqp = require('amqplib');
var when = require('when');
var config = require('../../../config');
var routingKey = 'sharepear.picture.new';

amqp.connect(config.rabbitmq.url).then(function(conn) {
    var ok = conn.createChannel();
    return ok.then(function(channel) {
        return when.all([
            channel.assertQueue(routingKey, {durable: config.rabbitmq.durable}),
            channel.consume(routingKey, function(msg) {
                console.log(" [%s] Received msg '%s'", routingKey, msg);
                var content = JSON.parse(msg.content.toString());
                console.log(content.filePath);
            }, {noAck: true}),
            console.log(' [%s] Waiting for msg. To exit press CTRL+C', routingKey)
        ]);
    });
}).then(null, console.warn);
