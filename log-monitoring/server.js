const express = require("express");
const mysql = require("mysql2");
const fs = require("fs");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const LOG_FILE = path.join(__dirname, "logs.txt");
let logs = [];

// Load existing logs from file
if (fs.existsSync(LOG_FILE)) {
    logs = fs.readFileSync(LOG_FILE, "utf8").split("\n").filter(Boolean);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dash.html"));
});

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",  
    password: "root", 
    database: "lifeflowhub"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL Database");
});

// If user table doesn't exist
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL
    )
`;

db.query(createTableQuery, (err) => {
    if (err) {
        console.error("Error creating users table:", err);
    } else {
        console.log("Users table is ready");
    }
});

// Handle user signup request
app.post("/signup", (req, res) => {
    console.log("Received Data:", req.body);

    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    const sql = "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)";
    db.query(sql, [name, email, phone], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error. Try again." });
        }
        res.json({ success: true, message: "User registered successfully!", userId: result.insertId });
    });
});

// WebSocket connection for real-time log updates
wss.on("connection", (ws) => {
    console.log("Client connected");

    // Send initial logs
    ws.send(JSON.stringify({ type: "initial", data: logs }));

    ws.on("message", (message) => {
        console.log("📩 Received log:", message);
        
        const log = JSON.parse(message);
        const logEntry = `[${new Date().toISOString()}] [${log.type}]: ${log.message}`;
        logs.push(logEntry);

        // Append log to file
        fs.appendFileSync(LOG_FILE, logEntry + "\n");

        // Broadcast new log to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "new-log", data: logEntry }));
            }
        });
    });

    ws.on("close", () => console.log("Client disconnected"));
});

// Start Server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
