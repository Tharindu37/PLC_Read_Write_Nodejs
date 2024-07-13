const Modbus = require('modbus-serial');

// PLC IP address and port
const PLC_IP = '192.168.1.221';
const PLC_PORT = 502;

// Modbus TCP function codes
const READ_HOLDING_REGISTERS = 0x03;

// Create a Modbus client instance
const client = new Modbus();

// Function to read specific holding register
async function readSpecificRegister(registerAddress) {
    try {
        // Connect to the PLC
        await client.connectTCP(PLC_IP, { port: PLC_PORT });

        // Read the specific register (single register)
        const response = await client.readHoldingRegisters(registerAddress, 1);

        // Close the connection
        client.close();

        return response.data[0]; // Return the value of the register
    } catch (err) {
        console.error('Error:', err);
        client.close();
        return null;
    }
}

// Example usage:
const registerAddress = 0; // Adjust based on your PLC memory map

// Function to continuously read and display register value every 1 second
async function readContinuously() {
    try {
        const registerValue = await readSpecificRegister(registerAddress);
        console.log(`Register ${registerAddress} value: ${registerValue}`);

        // Schedule the next read after 1 second
        setTimeout(readContinuously, 2000);
    } catch (err) {
        console.error('Error:', err);
    }
}

// Start continuous reading
readContinuously();
