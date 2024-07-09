const ModbusRTU = require('modbus-serial');

// Create a Modbus client instance
const client = new ModbusRTU();

// Set the properties of the Modbus client

client.connectTCP('192.168.1.205', { port: 502 })
  .then(() => {
    // Connected
    console.log('Connected to PLC');

    // Read Holding Registers (example: read from address 0, 1 register)
    setInterval(()=>{
        client.readHoldingRegisters(1, 3)
      .then(data => {
        console.log('Read data:', data.data);
      })
      .catch(err => {
        console.error('Error reading:', err);
      });
    })
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
  });