# Sharepear Back

Sharepear is photo gallery open source.


## Prerequis

* rabbitmq
* node


## Install

Clone this repo and execute in your favourite shell:

* `npm i` to install local npm dependencies
* `cp config.js.dist config.js` and configure for your server
* `node src/rabbitmq/queues.js` create all queues in rabbitmq


## Play

After completing installation type in your favourite shell:

* `node src/app.js` to start a this app.
