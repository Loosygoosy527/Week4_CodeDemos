const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const os = require('os');

const KEY_PATH = path.join(__dirname, 'key.pem');
const CERT_PATH = path.join(__dirname, 'cert.pem');

if (!fs.existsSync(KEY_PATH) || !fs.existsSync(CERT_PATH)) {
  console.error('');
  console.error('Missing key.pem / cert.pem.');
  console.error('Generate a self-signed certificate first:');
  console.error('');
  console.error('  openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"');
  console.error('');
  process.exit(1);
}

const server = require('https').createServer(
  {
    key: fs.readFileSync(KEY_PATH),
    cert: fs.readFileSync(CERT_PATH),
  },
  app
);
const io = require('socket.io')(server);

// disable caching on everything served from /public
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('device connected:', socket.id);

  // relay any "control" message straight to everyone else in the room
  socket.on('control', (data) => {
    socket.broadcast.emit('control', data);
  });

  socket.on('disconnect', () => {
    console.log('device disconnected:', socket.id);
  });
});

const PORT = 3000;

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

server.listen(PORT, () => {
  const ip = getLocalIP();
  console.log('');
  console.log('Play environment handoff server running (HTTPS)');
  console.log('-------------------------------------------------');
  console.log('Laptop (environment):');
  console.log(`  https://localhost:${PORT}/laptop.html`);
  console.log('');
  console.log('Phone (remote) — on the same Wi-Fi as this laptop:');
  console.log(`  https://${ip}:${PORT}/phone.html`);
  console.log('');
  console.log('The phone will show a certificate warning on first visit');
  console.log('(self-signed cert) — tap "Show Details" then "visit this');
  console.log('website" to proceed. This only needs to happen once.');
  console.log('-------------------------------------------------');
  console.log('');
});
