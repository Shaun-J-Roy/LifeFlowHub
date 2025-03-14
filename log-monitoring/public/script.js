const socket = new WebSocket("ws://localhost:3000");
const logContainer = document.getElementById("log-container");
const filterSelect = document.getElementById("filter");
const logTypeSelect = document.getElementById("logType");
const logMessageInput = document.getElementById("logMessage");

let logs = [];

// WebSocket connection to receive logs
socket.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data);

    if (type === "initial" || type === "update") {
        logs = data;
        renderLogs();
    } else if (type === "new-log") {
        logs.push(data);
        renderLogs();
    }
};

// Filter logs when dropdown changes
filterSelect.addEventListener("change", renderLogs);

function renderLogs() {
    logContainer.innerHTML = "";
    const selectedType = filterSelect.value;

    logs.forEach(log => {
        if (selectedType === "ALL" || log.includes(`[${selectedType}]`)) {
            const logEntry = document.createElement("p");
            logEntry.className = "log-item";
            logEntry.textContent = log;
            logContainer.appendChild(logEntry);
        }
    });
}

// Function to send logs to the server (Now using POST request)
function sendLog() {
    const logType = logTypeSelect.value;
    const logMessage = logMessageInput.value.trim();

    if (!logMessage) {
        alert("Please enter a log message!");
        return;
    }

    fetch("/log", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ type: logType, message: logMessage })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        logMessageInput.value = ""; // Clear input after submission
    })
    .catch(error => console.error("Error:", error));
}
