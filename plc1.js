const Modbus = require('modbus-serial');

// PLC IP address and port
const PLC_IP = '192.168.1.221';
const PLC_PORT = 502;

// Modbus TCP function codes
const READ_HOLDING_REGISTERS = 0x03;

// Create a Modbus client instance
const client = new Modbus();

// Function to read holding registers
async function readHoldingRegisters(startingAddress, quantity) {
    try {
        // Connect to the PLC
        await client.connectTCP(PLC_IP, { port: PLC_PORT });

        // Read holding registers
        const response = await client.readHoldingRegisters(startingAddress, quantity);

        // Close the connection
        client.close();

        return response.data; // Array of register values
    } catch (err) {
        console.error('Error:', err);
        client.close();
        return null;
    }
}

// Example usage:
const startingAddress = 0;  // Adjust based on your PLC memory map
const quantity = 10;  // Number of registers to read

readHoldingRegisters(startingAddress, quantity)
    .then(registers => {
        if (registers !== null) {
            console.log('Read registers:', registers);
        }
    })
    .catch(err => {
        console.error('Error:', err);
    });
