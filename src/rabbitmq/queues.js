var amqp = require('amqplib');
var when = require('when');
var config = require('../../config');

amqp.connect(config.rabbitmq.url).then(function(conn) {
    return conn.createChannel().then(function(channel) {
        var ok = when.all([
            //change durable to false for rabbitmq not to loose the queue
            channel.assertQueue('sharepear.picture.new', {durable: config.rabbitmq.durable}),
            channel.assertExchange('sharepear', 'direct', {durable: config.rabbitmq.durable}),
            channel.bindQueue('sharepear.picture.new', 'sharepear', 'sharepear.picture.new'),
            console.log(' [*] Queues and Exchange created.')
        ]);
        ok.then(function (_qok) {
            return channel.close();
        }).ensure(function() { conn.close(); });
    });
}).then(null, console.warn);
