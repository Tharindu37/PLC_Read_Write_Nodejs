const socket = new WebSocket('ws://192.168.1.200:502');

socket.addEventListener('open', function (event) {
  console.log('Connected to barcode reader');
});

socket.addEventListener('message', function (event) {
  const barcodeData = event.data; // Assuming the data received is the barcode content
  console.log('Received barcode:', barcodeData);
  // Process or display the barcode data as needed
});

socket.addEventListener('close', function (event) {
  console.log('Connection closed');
});

socket.addEventListener('error', function (event) {
  console.error('Socket error:', event);
});
