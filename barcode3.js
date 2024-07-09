const net = require('net');

const client = new net.Socket();
const scannerHost = '192.168.1.205'; // Replace with the IP of your scanner
const scannerPort = 502; // Replace with the port configured on your scanner

client.connect(scannerPort, scannerHost, () => {
  console.log('Connected to scanner');
});

client.on('data', (data) => {
  console.log('Received data from scanner:', data.toString());
  // Process the received data as needed
});

// Send data to scanner
// client.write('Your data here');
