const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, "app")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "app", "vote.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "app", "admin.html"));
});

app.get("/result", (req, res) => {
  res.sendFile(path.join(__dirname, "app", "result.html"));
});

let votes = {
  option1: 0,
  option2: 0,
};

let resetCount = 0;
let voterCount = 0; // Variable to track the number of people who have voted
let totalConnections = 0; // Track total active connections

const resetVotes = () => {
  votes = { option1: 0, option2: 0 };
  io.emit("updateVotes", votes);
  voterCount = 0; // Reset voter count when votes are reset
  io.emit("resetComplete"); // Inform the admin that the reset is complete
};

io.on("connection", (socket) => {
  totalConnections++; // Increment total connections when a new user connects
  console.log("New user connected. Total connections: " + totalConnections);

  // Send current votes to the newly connected client
  socket.emit("updateVotes", votes);

  socket.on("unlockVoting", () => {
    resetCount++;
    if (resetCount >= 3) {
      resetVotes();
      resetCount = 0;
    }
    io.emit("votingUnlocked");
    io.emit("updateVotes", votes);
    io.emit("resetCountUpdate", resetCount);
  });

  socket.on("vote", (option) => {
    if (votes.hasOwnProperty(option)) {
      votes[option]++;
      io.emit("updateVotes", votes);
      voterCount++; // Increment voter count on each vote
      // Check if all connected users have voted
      if (voterCount >= totalConnections) {
        io.emit("allVoted"); // Inform admin that all connected clients have voted
      }
    }
  });

  // Decrement total connections on disconnect and reset votes if no users are connected
  socket.on("disconnect", () => {
    totalConnections--;
    console.log("User disconnected. Total connections: " + totalConnections);
    if (totalConnections === 0) {
      // Optionally reset votes if you want a fresh start when no one is connected
      resetVotes();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
