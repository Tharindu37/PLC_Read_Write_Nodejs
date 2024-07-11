const net = require('net');
const ModbusRTU = require('modbus-serial');


const serverPort = 2002;
const serverAddress = '192.168.1.205'; // Replace with your server's IP address if needed
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
        console.log(message)
        if(message!=barcode){
            // barcode=message;
            readWeight();
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

function readWeight(){
   
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
            console.log('Read data:', data.data[1]*10 + "kg");
            console.log('Read data:',typeof data.data);
            client.removeAllListeners();
            if(400> data.data[1]*10){
                writeStatus(1);
            }else{
                writeStatus(0)
            }
        })
        .catch(err => {
            console.error('Error reading:', err);
        }).finally(() => {
            // Close the connection after reading/writing
            client.close();
            console.log('Connection closed');
        });;
    })
    .catch(err => {
        console.error('Connection failed:', err.message);
    });
}

function writeStatus(status){
    // Create a Modbus client instance
    const client = new ModbusRTU();

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

        // Write Holding Registers (example: write value 123 to address 10)
        // client.writeRegisters(10, [123])
        client.writeRegisters(1, [status])
        .then(() => {
            console.log('Write successful');
        })
        .catch(err => {
            console.error('Error writing:', err);
        })
        .finally(() => {
            // Close the connection after reading/writing
            client.close();
            console.log('Connection closed');
        });
    })
    .catch(err => {
        console.error('Connection failed:', err.message);
    });

}