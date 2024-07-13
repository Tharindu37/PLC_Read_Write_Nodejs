const net = require('net');

// PLC IP address and port
const PLC_IP = '192.168.1.221';
const PLC_PORT = 502;

// Modbus TCP function codes
const READ_HOLDING_REGISTERS = 0x03;

// Function to create and manage a Modbus TCP socket connection
function createModbusSocket() {
    const socket = new net.Socket();

    socket.connect(PLC_PORT, PLC_IP, () => {
        console.log('Connected to PLC');

        // Function to send Modbus TCP frame for reading holding registers
        function readHoldingRegister(deviceAddress, registerAddress) {
            return new Promise((resolve, reject) => {
                const transactionId = Buffer.from([0x00, 0x01]); // Transaction ID (2 bytes)
                const protocolId = Buffer.from([0x00, 0x00]); // Protocol ID (2 bytes)
                const length = Buffer.from([0x00, 0x06]); // Length (2 bytes)
                const unitId = Buffer.from([deviceAddress]); // Device address (1 byte)
                const functionCode = Buffer.from([READ_HOLDING_REGISTERS]); // Function code (1 byte)
                const startAddress = Buffer.alloc(2); // Starting address (2 bytes)
                startAddress.writeUInt16BE(registerAddress, 0);
                const regQuantity = Buffer.alloc(2); // Quantity of registers to read (2 bytes)
                regQuantity.writeUInt16BE(1, 0); // Read 1 register

                // Combine all parts into a single Modbus TCP frame
                const frame = Buffer.concat([transactionId, protocolId, length, unitId, functionCode, startAddress, regQuantity]);

                // Send the Modbus TCP frame
                socket.write(frame);

                // Handle response from PLC
                socket.once('data', (data) => {
                    // Parse the Modbus TCP response
                    const transactionIdResp = data.slice(0, 2); // Transaction ID (2 bytes)
                    const protocolIdResp = data.slice(2, 4); // Protocol ID (2 bytes)
                    const lengthResp = data.slice(4, 6); // Length (2 bytes)
                    const unitIdResp = data.slice(6, 7); // Device address (1 byte)
                    const functionCodeResp = data.slice(7, 8); // Function code (1 byte)
                    const byteCount = data.slice(8, 9).readUInt8(); // Number of bytes in data section
                    const registerValue = data.slice(9, 9 + byteCount); // Actual register data

                    // Resolve with the register value
                    resolve(registerValue.readUInt16BE());

                    // Continue listening for more data (real-time)
                    socket.once('data', handleData);
                });

                // Handle connection errors
                socket.once('error', (err) => {
                    reject(err);
                    socket.destroy(); // Clean up socket on error
                });
            });
        }

        // Function to continuously read and process register value
        function handleData(data) {
            // Parse the Modbus TCP response
            const transactionIdResp = data.slice(0, 2); // Transaction ID (2 bytes)
            const protocolIdResp = data.slice(2, 4); // Protocol ID (2 bytes)
            const lengthResp = data.slice(4, 6); // Length (2 bytes)
            const unitIdResp = data.slice(6, 7); // Device address (1 byte)
            const functionCodeResp = data.slice(7, 8); // Function code (1 byte)
            const byteCount = data.slice(8, 9).readUInt8(); // Number of bytes in data section
            const registerValue = data.slice(9, 9 + byteCount); // Actual register data

            // Output the register value
            console.log(`Real-time value of register at device ${unitIdResp.readUInt8()}: ${registerValue.readUInt16BE()}`);

            // Continue listening for more data (real-time)
            socket.once('data', handleData);
        }

        // Example usage: Read register 0 from device address 1 continuously
        const deviceAddress = 1;
        const registerAddress = 0;

        readHoldingRegister(deviceAddress, registerAddress)
            .then((registerValue) => {
                console.log(`Initial value of register ${registerAddress} at device ${deviceAddress}: ${registerValue}`);
                
                // Start real-time monitoring
                socket.once('data', handleData);
            })
            .catch((err) => {
                console.error('Error:', err);
            });
    });

    // Handle socket closure
    socket.once('close', () => {
        console.log('Connection closed');
    });

    return socket;
}

// Create and maintain the Modbus socket connection
const modbusSocket = createModbusSocket();
