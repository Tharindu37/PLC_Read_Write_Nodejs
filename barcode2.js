const WebSocket = require('ws');

// WebSocket client setup
const socket = new WebSocket('ws://192.168.1.205:502');

// WebSocket event handlers
socket.on('open', function () {
  console.log('Connected to WebSocket server');
});

socket.on('message', function (data) {
  console.log('Received barcode:', data);
  // Process or display the barcode data as needed
});

socket.on('close', function () {
  console.log('Connection closed');
});

socket.on('error', function (err) {
  console.error('Socket error:', err.message);
});
