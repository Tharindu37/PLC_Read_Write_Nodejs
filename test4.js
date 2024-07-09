const ModbusRTU = require('modbus-serial');

// Create a Modbus client instance
const client = new ModbusRTU();

setInterval(()=>{
       // Set the properties of the Modbus client
client.connectTCP('192.168.1.221', { port: 502 })
.then(() => {
  // Connected
  console.log('Connected to PLC');

  // Read Holding Registers (example: read from address 0, 1 register)
  client.readHoldingRegisters(0, 1)
      .then(data => {
        console.log('Read data:', data.data);
      })
      .catch(err => {
        
          console.error('Error reading:', err);

      });

    

  // client.readHoldingRegisters(0, 1)
  //     .then(data => {
  //       console.log('Read data:', data.data);
  //     })
  //     .catch(err => {
  //       console.error('Error reading:', err);
  //     });

  // Write Holding Registers (example: write value 123 to address 10)
  // client.writeRegisters(10, [123])
  // client.writeRegisters(0, [2])
  //   .then(() => {
  //     console.log('Write successful');
  //   })
  //   .catch(err => {
  //     console.error('Error writing:', err);
  //   })
  //   .finally(() => {
  //     // Close the connection after reading/writing
  //     client.close();
  //     console.log('Connection closed');
  //   });
})
.catch(err => {
  console.error('Connection failed:', err.message);
}); 
},100)

