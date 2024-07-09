const net = require('net');

// Replace with your barcode scanner's IP address and port number
const scannerHost = '192.165,1.205`'; // Example IP address
const scannerPort = 2002; // Example port number

// Create a new TCP client socket
const client = new net.Socket();

// Connect to the scanner
client.connect(scannerPort, scannerHost, () => {
  console.log(`Connected to ${scannerHost}:${scannerPort}`);

  // Handle incoming data from the scanner
  client.on('data', (data) => {
    const barcodeData = data.toString().trim();
    console.log(`Received data from scanner: ${barcodeData}`);
    // Process the scanned barcode data here
  });

  // Handle socket closure
  client.on('close', () => {
    console.log('Connection to scanner closed');
  });

  // Handle errors
  client.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

// Handle socket connection errors
client.on('error', (err) => {
  console.error('Connection to scanner failed:', err);
});
