const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let users = {};

wss.on('connection', (ws) => {

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);

    // register
    if (msg.type === 'register') {
      users[msg.user] = ws;
      ws.user = msg.user;
    }

    // relay
    if (msg.to && users[msg.to]) {
      users[msg.to].send(JSON.stringify(msg));
    }
  });

  ws.on('close', () => {
    if (ws.user) delete users[ws.user];
  });
});
