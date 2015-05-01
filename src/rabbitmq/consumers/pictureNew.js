var amqp = require('amqplib');
var when = require('when');
var fs = require('fs');
var path = require('path');
var sharp = require('sharp');
var config = require('../../../config');
var routingKey = 'sharepear.picture.new';

try {fs.mkdirSync(config.sharepear.dirname + config.sharepear.uploadPath);} catch(e) {if ( e.code != 'EEXIST' ) throw e;}
try {fs.mkdirSync(config.sharepear.dirname + config.sharepear.resizePath);} catch(e) {if ( e.code != 'EEXIST' ) throw e;}

amqp.connect(config.rabbitmq.url).then(function(conn) {
    var ok = conn.createChannel();
    return ok.then(function(channel) {
        return when.all([
            channel.assertQueue(routingKey, {durable: config.rabbitmq.durable}),
            channel.consume(routingKey, function(msg) {
                console.log(" [%s] Received msg '%s'", routingKey, msg);
                var content = JSON.parse(msg.content.toString());
                var filePath = config.sharepear.dirname + '/' + content.filePath;
                var fileRename = config.sharepear.dirname + config.sharepear.resizePath + '/' + path.basename(content.filePath);
                var image = sharp(filePath);
                image.resize(config.sharepear.size.big, config.sharepear.size.big).max().progressive().blur(200).toFile(fileRename, function(err) {});
//                image.resize(config.sharepear.size.small, config.sharepear.size.small).max().toFile(fileRename, function(err) {});
//                fs.unlink(filePath, function(err){});
                    // output.jpg is a 300 pixels wide and 200 pixels high image
                    // containing a scaled and cropped version of input.jpg
                //fs.rename(filePath, fileRename, function(err){
                //    if (err) throw err;
                //    console.log('renamed complete');
                //});
            }, {noAck: true}),
            console.log(' [%s] Waiting for msg. To exit press CTRL+C', routingKey)
        ]);
    });
}).then(null, console.warn);
