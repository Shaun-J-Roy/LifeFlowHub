// Connect to WebSocket server
const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => console.log(" Connected to WebSocket");

let logs = []; // Initialize logs array

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "update" || data.type === "initial") {
        logs = data.data; // Assign received logs
        updateLogs();
    } else if (data.type === "new-log") {
        logs.push(data.data);
        updateLogs();
    }
};

socket.onerror = (error) => console.error(" WebSocket Error:", error);
socket.onclose = () => console.log(" WebSocket closed");

// Function to update logs on the page
function updateLogs() {
    console.log("Updating logs:", logs); // Debugging line
    const logContainer = document.getElementById("log-container");
    const filterSelect = document.getElementById("filter");
    const selectedType = filterSelect ? filterSelect.value : "ALL";

    logContainer.innerHTML = logs
        .filter(log => selectedType === "ALL" || log.includes(`[${selectedType}]`))
        .map(log => `<p>${log}</p>`)
        .join("");
}

// Event listener for filter selection
const filterSelect = document.getElementById("filter");
if (filterSelect) {
    filterSelect.addEventListener("change", updateLogs);
}

// Function to send a log message to the WebSocket server
window.sendLog = function () {
    const logType = document.getElementById("logType").value;
    const logMessage = document.getElementById("logMessage").value.trim();

    if (!logMessage) {
        alert("Please enter a log message!");
        return;
    }

    if (socket.readyState === WebSocket.OPEN) {
        console.log(" Sending log:", { type: logType, message: logMessage });
        socket.send(JSON.stringify({ type: logType, message: logMessage }));
    } else {
        console.error(" WebSocket is not open! Log not sent.");
    }

    document.getElementById("logMessage").value = "";
};