const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

let users = {};

console.log("Signaling running on", PORT);

wss.on('connection', (ws) => {

  ws.on('message', (data) => {
    let msg;

    try {
      msg = JSON.parse(data);
    } catch {
      return;
    }

    // Register user
    if (msg.type === 'register') {
      users[msg.user] = ws;
      ws.user = msg.user;

      console.log("Registered:", msg.user);
      return;
    }

    // Relay to target
    if (msg.to && users[msg.to]) {
      users[msg.to].send(JSON.stringify(msg));
    }
  });

  ws.on('close', () => {
    if (ws.user) {
      delete users[ws.user];
      console.log("Disconnected:", ws.user);
    }
  });

});
