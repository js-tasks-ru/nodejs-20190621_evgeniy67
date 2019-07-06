const EventEmitter = require('events');

class Chat extends EventEmitter {
  constructor() {
    super();

    this.stackMessages = [];
  }

  add(message) {
    this.stackMessages.push(message);

    this.emit('change', message);
  }
}

module.exports = Chat;
