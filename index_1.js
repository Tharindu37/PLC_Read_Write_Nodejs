// Import required modules
const express = require('express');
const ModbusRTU = require('jsmodbus');
const net = require('net');
const mysql = require('mysql2');

// Create an Express application
const app = express();
const port = 3002;

// Express middleware to parse JSON bodies
app.use(express.json());

// Modbus and MySQL configurations
const plcIp = '192.168.1.100'; // Replace with your PLC's IP address
const plcPort = 502; // Modbus TCP default port
const socket = new net.Socket();
let client = null; // Initialize Modbus client variable

// MySQL connection pool
let pool = null;

// Endpoint to connect to the PLC
app.post('/plc/connect', (req, res) => {
    if (client && client.isOpen) {
        return res.status(400).json({ success: false, message: 'Already connected to PLC' });
    }

    client = new ModbusRTU.client.TCP(socket, 1); // Unit ID of the PLC
    socket.connect({ host: plcIp, port: plcPort }, () => {
        console.log('Connected to PLC');
        res.json({ success: true, message: 'Connected to PLC' });
    });

    socket.on('error', (err) => {
        console.error('Modbus connection error:', err);
        res.status(500).json({ success: false, message: 'Failed to connect to PLC', error: err.message });
    });
});

// Endpoint to disconnect from the PLC
app.post('/plc/disconnect', (req, res) => {
    if (!client || !client.isOpen) {
        return res.status(400).json({ success: false, message: 'Not connected to PLC' });
    }

    socket.end(() => {
        console.log('Disconnected from PLC');
        res.json({ success: true, message: 'Disconnected from PLC' });
    });
});

// Endpoint to connect to MySQL
app.post('/mysql/connect', (req, res) => {
    if (pool) {
        return res.status(400).json({ success: false, message: 'Already connected to MySQL' });
    }

    pool = mysql.createPool({
        host: 'localhost', // MySQL server host
        user: 'root', // MySQL user
        password: 'password', // MySQL password
        database: 'plc_database', // MySQL database name
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    console.log('Connected to MySQL');
    res.json({ success: true, message: 'Connected to MySQL' });
});

// Endpoint to disconnect from MySQL
app.post('/mysql/disconnect', (req, res) => {
    if (!pool) {
        return res.status(400).json({ success: false, message: 'Not connected to MySQL' });
    }

    pool.end((err) => {
        if (err) {
            console.error('Error disconnecting from MySQL:', err);
            return res.status(500).json({ success: false, message: 'Failed to disconnect from MySQL', error: err.message });
        }

        pool = null;
        console.log('Disconnected from MySQL');
        res.json({ success: true, message: 'Disconnected from MySQL' });
    });
});

// Define a route to read data from the PLC and save it to MySQL
app.get('/read', async (req, res) => {
    if (!client || !client.isOpen) {
        return res.status(500).json({ success: false, message: 'Not connected to PLC' });
    }

    try {
        // Read 10 holding registers starting at address 0
        const response = await client.readHoldingRegisters(0, 10);
        const values = response.response._body.values;

        if (!pool) {
            return res.status(500).json({ success: false, message: 'Not connected to MySQL' });
        }

        // Insert the PLC data into MySQL
        const query = 'INSERT INTO plc_data (timestamp, register_0, register_1, register_2, register_3, register_4, register_5, register_6, register_7, register_8, register_9) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        const timestamp = new Date();
        const data = [timestamp, ...values];

        pool.execute(query, data, (err, results) => {
            if (err) {
                console.error('Error inserting into MySQL:', err);
                return res.status(500).json({ success: false, message: 'Error saving data to MySQL', error: err.message });
            }
            res.json({
                success: true,
                message: 'Data read from PLC and saved to MySQL successfully',
                plcData: values,
                mysqlResult: results
            });
        });
    } catch (err) {
        console.error('Error reading from PLC:', err);
        res.status(500).json({ success: false, message: 'Error reading from PLC', error: err.message });
    }
});

// Define a route to write data to the PLC
app.post('/write', async (req, res) => {
    if (!client || !client.isOpen) {
        return res.status(500).json({ success: false, message: 'Not connected to PLC' });
    }

    try {
        const { address, value } = req.body;

        // Write a single register
        const response = await client.writeSingleRegister(address, value);

        if (!pool) {
            return res.status(500).json({ success: false, message: 'Not connected to MySQL' });
        }

        // Log the write operation to MySQL
        const logQuery = 'INSERT INTO plc_write_log (timestamp, register_address, register_value) VALUES (?,?,?)';
        const logData = [new Date(), address, value];

        pool.execute(logQuery, logData, (err, results) => {
            if (err) {
                console.error('Error logging to MySQL:', err);
                return res.status(500).json({ success: false, message: 'Error logging write operation to MySQL', error: err.message });
            }
            res.json({
                success: true,
                message: 'Data written to PLC and logged to MySQL successfully',
                plcWriteResponse: response.response,
                mysqlLogResult: results
            });
        });
    } catch (err) {
        console.error('Error writing to PLC:', err);
        res.status(500).json({ success: false, message: 'Error writing to PLC', error: err.message });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});

// Handle socket connection errors and closure
socket.on('error', (err) => {
    console.error('Modbus connection error:', err);
    // Implement reconnection logic if needed
});

socket.on('close', () => {
    console.log('Modbus connection closed');
    // Optionally attempt to reconnect here
});
