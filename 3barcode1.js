const net = require('net');

const serverPort = 2002;
const serverAddress = '192.168.1.205'; // Replace with your server's IP address if needed
const serverAddress2 = '192.168.1.206';
const serverAddress3 = '192.168.1.207';
let barcode = ''
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
        console.log('barcode 1',message)
        if(message!=barcode){
            // barcode=message;
            
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

function Barcode2Scan(){
    // Create a TCP client socket
    const client = new net.Socket();

    // Connect to the server
    client.connect(serverPort, serverAddress2, () => {
        console.log(`Connected to server at ${serverAddress2}:${serverPort}`);
    });

    // Handle incoming data from the server
    client.on('data', (data) => {
    console.log(data)
        const message = data.toString().trim();
        console.log('barcode 2',message)
        if(message!=barcode){
            // barcode=message;
            
        }
    });

    // Handle connection close
    client.on('close', () => {
        console.log('Connection to server closed');
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode2Scan,2000);
    });

    // Handle connection errors
    client.on('error', (err) => {
        console.error('Connection error:', err);
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode2Scan,2000);
    });

    // Handle server connection timeout
    client.on('timeout', () => {
        console.error('Connection to server timed out');
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode2Scan,2000);
    });

    // Handle client socket end
    client.on('end', () => {
        console.log('Disconnected from server');
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode2Scan,2000);
    });
}

function Barcode3Scan(){
    // Create a TCP client socket
    const client = new net.Socket();

    // Connect to the server
    client.connect(serverPort, serverAddress3, () => {
        console.log(`Connected to server at ${serverAddress3}:${serverPort}`);
    });

    // Handle incoming data from the server
    client.on('data', (data) => {
    console.log(data)
        const message = data.toString().trim();
        console.log('barcode 3',message)
        if(message!=barcode){
            // barcode=message;
            
        }
    });

    // Handle connection close
    client.on('close', () => {
        console.log('Connection to server closed');
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode3Scan,2000);
    });

    // Handle connection errors
    client.on('error', (err) => {
        console.error('Connection error:', err);
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode3Scan,2000);
    });

    // Handle server connection timeout
    client.on('timeout', () => {
        console.error('Connection to server timed out');
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode3Scan,2000);
    });

    // Handle client socket end
    client.on('end', () => {
        console.log('Disconnected from server');
        client.removeAllListeners()
        client.destroy();
        setTimeout(Barcode3Scan,2000);
    });
}

Barcode3Scan();
Barcode2Scan();
Barcode1Scan();