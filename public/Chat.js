/*
  TODO Validadores e Sanitizadores
  TODO Setar o endpoint do servidor de mensagens (app.js) atraves de process.env
  TODO Tratamento de erro simples
*/

// O modo de importacao do ES6 do Socket.io nao esta funcionando no chrome
// import io from 'socket.io-client';

// const socket = io.connect('http://192.168.0.189:4040');

export default class Chat {

  // Inicia a classe Chat com o nome do user
  constructor(username) {
    this.chatInput = document.getElementById('chatInput');
    this.chatList = document.getElementById('chatList');

    // set
    this.username = username;
    this.typing = false;
    this.lastTypingTime = 0;
    this.TYPING_TIME = 400;

    // connect Socket.io to global namespace
    this.socket = io("/global");

    // Emit join client event
    this.socket.emit('join', this.username);

    this.setupUsername();
    this.setupSocket();
    this.setupEvents();
  }

  setupSocket() {
    // Whenever the server emits 'start typing', show the typing message
    this.socket.on('start typing', (data) => {
      this._addChatTyping(data);
    });

    // Whenever the server emits 'stop typing', kill the typing message
    this.socket.on('stop typing', (data) => {
      this._removeChatTyping(data);
    });

    this.socket.on('connect', () => {

    });

    this.socket.on('clients', (clients) => {
      console.log("clients", clients);
    });

    this.socket.on("chat", (data) => {
      console.log("chat", data);
      this._addChatLine(data.username, data.message, false);
    });

    this.socket.on('user joined', (user) => {
      console.log(user.username + " joined. " + user.clientCount + " user(s) connected.");
      this._addStatusLine(user.username + " joined. " + user.clientCount + " user(s) connected.");
      this.addUser(user);
    });

    this.socket.on('user left', (user) => {
      console.log(user.username + " left. " + user.clientCount + " user(s) connected.");
      this._addStatusLine(user.username + " left. " + user.clientCount + " user(s) connected.");
      this.removeUser(user);
    });
  }

  setupEvents() {
    this.chatInput.addEventListener('input', () => {
      this.updateTyping();
    });

    // chatInput Enter Key Event
    this.chatInput.addEventListener('keypress', (key) => {
      key = key.which || key.keyCode;
      if (key === 13) {
        this.sendChat(this.chatInput.value);
        this.chatInput.value = '';
      }
    });

    // chatInput Esc Key Event
    this.chatInput.addEventListener('keyup', (key) => {
      key = key.which || key.keyCode;
      if (key === 27) {
        this.chatInput.value = '';
      }
    });
  }

  addUser(user) {
    try {

    } catch(e) {
      throw new Error(e);
    }
  }

  removeUser(user) {
    try {

    } catch(e) {
      throw new Error(e);
    }
  }

  sendChat(text) {
    try {
      if (text) {
        this.socket.emit('stop typing');
        this.typing = false;
        this.socket.emit('send', text);
        this._addChatLine(this.username, text, true);
      }
    } catch(e) {
      throw new Error(e);
    }
  }

  // Set the client username
  setupUsername() {
    try {
      // Tell the server the client has joined and his username
      this.socket.emit('add user', this.username);
    } catch(e) {
      throw new Error(e);
    }
  };

  // Updates the typing event
  updateTyping() {
    if (!this.typing) {
      this.typing = true;
      this.socket.emit('start typing');
    }
    this.lastTypingTime = (new Date()).getTime();

    setTimeout(() => {
      var typingTimer = (new Date()).getTime();
      var timeDiff = typingTimer - this.lastTypingTime;
      if (timeDiff >= this.TYPING_TIME && this.typing) {
        this.socket.emit('stop typing');
        this.typing = false;
      }
    }, this.TYPING_TIME);
  }

  _addChatLine(name, message, me) {
    try {
      console.log("_addChatLine", name, message, me);

      let time = new Date();
      let location = {
        city: "Rio de Janeiro",
        neighborhood: "Cinelândia"
      }

      let node = document.createElement('div');
      let content = `
        <img class="message-avatar rounded-circle" src="http://via.placeholder.com/48/`+((me) ? '9200CE' : '0092CE')+`/fff.png?text=`+name.toUpperCase().substring(0,1)+`" alt="">
        <div class="message">
          <a class="message-author" href="#">` + name + `</a><small> ` + location.city + ` &#8226; ` + location.neighborhood + `</small>
          <span class="message-date">` + time.toLocaleTimeString() + `</span>
          <span class="message-content">
          ` + message + `&#128542;
          </span>
        </div>
      `;

      node.className = (me) ? 'chat-message right' : 'chat-message left';
      node.innerHTML = content;

      this._appendMessage(node);
    } catch(e) {
      throw new Error(e);
    }
  }

  _addStatusLine(message) {
    try {
      console.log("_addStatusLine", message);

      let time = new Date();
      let node = document.createElement('div');
      let content = `
        <div class="status">
          <span class="message-date">` + time.toLocaleTimeString() + `</span>
          <span class="message-content">
          ` + message + `
          </span>
        </div>
      `;

      node.innerHTML = content;

      this._appendMessage(node);
    } catch(e) {
      throw new Error(e);
    }
  }

  // Append message and scroll chatList to the bottom
  _appendMessage(node) {
    try {
      this.chatList.appendChild(node);
      this.chatList.scrollTop = this.chatList.scrollHeight;
    } catch(e) {
      throw new Error(e);
    }
  }

  // Adds the visual chat typing message
  _addChatTyping(data) {
    console.log("_addChatTyping", data);
    let node = document.createElement('div');
    let content = `
      <div class="typing" id=` + data.id + `>
        <p>` + data.username + ` esta digitando...</p>
      </div>
    `;
    node.innerHTML = content;
    this._appendMessage(node);
  }

  // Removes the visual chat typing message
  _removeChatTyping(data) {
    let node = document.getElementById(data.id);
    node.outerHTML = "";
  }

}
