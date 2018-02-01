"use strict";

import Chat from './chat.js';

class Chat {

  constructor() {
    this.client = {
      id: undefined,
      username: undefined,
      isAuthenticated: false
    }

    let joinButton = document.getElementById('joinButton');
    let nameInput = document.getElementById('nameInput');

    joinButton.onclick = () => {
      this.startChat(nameInput.value);
    };

    nameInput.addEventListener('keypress', (e) => {
      let key = e.which || e.keyCode;

      if (key === 13) {
        this.startChat(nameInput.value);
      }
    });
  }

  startChat(username) {
    this.client.username = username;
    this.chat = new Chat(this.client.username);

    document.getElementById('name-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
  }
}

// Start Chat main class after window finish load
window.onload = () => {
  new Chat();
};
