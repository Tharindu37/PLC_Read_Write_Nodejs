const ModbusRTU = require('modbus-serial');

// Create a Modbus client instance
const client = new ModbusRTU();

// Set the properties of the Modbus client

client.connectTCP('192.168.1.25', { port: 8080 })
  .then(() => {
    // Connected
    console.log('Connected to PLC');

    // Read Holding Registers (example: read from address 0, 1 register)
    client.readHoldingRegisters(4000, 3)
      .then(data => {
        console.log('Read data:', data.data);
      })
      .catch(err => {
        console.error('Error reading:', err);
      });
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
  });