const net = require('net');

const scannerHost = '192.168.1.25';
const scannerPort = 8080;  // replace with actual port

const client = new net.Socket();
client.connect(scannerPort, scannerHost, () => {
  console.log('Connected to scanner');

  client.on('data', data => {
    console.log('Received weight:', data.toString());
    client.end();  // Close connection after reading data
  });

  client.on('close', () => {
    console.log('Connection closed');
  });
});

client.on('error', err => {
  console.error('Error:', err);
});
