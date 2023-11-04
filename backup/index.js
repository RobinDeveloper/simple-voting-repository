const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'app' directory
app.use(express.static(path.join(__dirname, 'app')));

// Set route for the home path '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'vote.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'admin.html'));
});


app.get('/js/admin.js', (req, res) => {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, 'app', 'js', 'admin.js'));
});

// Store vote counts
let votes = {
    option1: 0,
    option2: 0
};

let isVotingLocked = true;

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('unlockVoting', () => {
        isVotingLocked = false;
        // Reset the vote counts when voting is unlocked
        votes = { option1: 0, option2: 0 };
        io.emit('votingUnlocked');
        io.emit('updateVotes', votes); // Send updated vote counts to all clients
    });

    // Send current vote counts to the connected client
    socket.emit('updateVotes', votes);

    // Handle incoming votes
    socket.on('vote', (option) => {
        votes[option]++;
        // Broadcast updated vote counts to all connected clients
        io.emit('updateVotes', votes);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


