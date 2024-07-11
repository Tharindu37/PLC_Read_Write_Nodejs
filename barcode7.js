const net = require('net');

const serverPort = 2002;
const serverAddress = '192.168.1.205'; // Replace with your server's IP address if needed

function Barcode1Scan(){
    // Create a TCP client socket
    const client = new net.Socket();

    // Connect to the server
    client.connect(serverPort, serverAddress, () => {
        console.log(`Connected to server at ${serverAddress}:${serverPort}`);
    });

    // Handle incoming data from the server
    client.on('data', (data) => {
    console.log(data)
        const message = data.toString().trim();
        if (message === 'heartbeat') {
            console.log('Received heartbeat from server');
        } else {
            console.log(`Received barcode: ${message}`);
            // Process the barcode data as needed
        }
    });

    // Handle connection close
    client.on('close', () => {
        console.log('Connection to server closed');
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode1Scan,2000);
    });

    // Handle connection errors
    client.on('error', (err) => {
        console.error('Connection error:', err);
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode1Scan,2000);
    });

    // Handle server connection timeout
    client.on('timeout', () => {
        console.error('Connection to server timed out');
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode1Scan,2000);
    });

    // Handle client socket end
    client.on('end', () => {
        console.log('Disconnected from server');
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode1Scan,2000);
    });
}

Barcode1Scan();

