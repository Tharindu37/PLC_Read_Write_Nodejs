const net = require('net');
const modbus = require('jsmodbus');
const express = require('express');

const app = express();
const netServer = new net.Server();
const server = new modbus.server.TCP(netServer, {});

// Store connected clients (PLCs)
let connectedClients = [];

server.on('connection', (client) => {
    console.log('New Connection from: ', client.socket.remoteAddress);
    
    // Store client information in the connectedClients array
    connectedClients.push({
        id: client.unitId, // assuming unitId is unique identifier for each client
        address: client.socket.remoteAddress,
        port: client.socket.remotePort
    });

    // Optionally, send a message or perform actions upon client connection
    client.write("Hello PLC!");
});

// Handle disconnections
server.on('socketError', (err) => {
    console.error('Socket error:', err.message);
});

server.on('close', () => {
    console.log('Server closed');
});

// Start Modbus TCP server on port 502 (standard Modbus TCP port)
netServer.listen(502, () => {
    console.log('Modbus TCP server is listening on port 502');
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to toggle the PLC state
app.post('/togglePLC', (req, res) => {
    // Toggle the PLC state
    togglePLC(req.body.state === 'on')
        .then(() => {
            res.status(200).send('PLC state toggled successfully');
        })
        .catch((err) => {
            console.error('Error toggling PLC state:', err);
            res.status(500).send('Failed to toggle PLC state');
        });
});

// Function to toggle PLC state (replace with your actual Modbus logic)
async function togglePLC(turnOn) {
    try {
        console.log(`Toggling PLC state to ${turnOn ? 'ON' : 'OFF'}...`);

        // Example: write to a single coil (change address and value as per your PLC configuration)
        const coilAddress = 0; // Example address of the coil to control
        const coilValue = turnOn ? 1 : 0; // 1 for ON, 0 for OFF

        await server.coils.writeSingleCoil(coilAddress, coilValue);

        console.log(`PLC state toggled to ${turnOn ? 'ON' : 'OFF'}.`);
    } catch (error) {
        throw new Error(`Error toggling PLC state: ${error.message}`);
    }
}

// Function to toggle PLC state (replace with your actual Modbus logic)
async function togglePLC(turnOn) {
    try {
        console.log(`Toggling PLC state to ${turnOn ? 'ON' : 'OFF'}...`);

        // Example: write to a single coil (change address and value as per your PLC configuration)
        const coilAddress = 0; // Example address of the coil to control
        const coilValue = turnOn ? 1 : 0; // 1 for ON, 0 for OFF

        // Create a Modbus client to communicate with the server
        const client = await modbus.tcp.connect({ host: '192.168.1.201', port: 502 });

        // Write to a single coil
        await client.writeSingleCoil(coilAddress, coilValue);

        console.log(`PLC state toggled to ${turnOn ? 'ON' : 'OFF'}.`);

        // Close the Modbus client
        await client.close();
    } catch (error) {
        throw new Error(`Error toggling PLC state: ${error.message}`);
    }
}


// Start the HTTP server on port 3000
app.listen(3000, () => {
    console.log('HTTP server is listening on port 3000');
});
