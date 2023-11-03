const socket = io();

// Function to unlock the voting system
document.getElementById('unlockVoting').addEventListener('click', () => {
    socket.emit('unlockVoting');
});

// Socket.io event to receive vote results
socket.on('voteResults', (results) => {
    const voteResults = document.getElementById('voteResults');
    voteResults.innerHTML = '<h2>Vote Results</h2>';

    for (const [voter, vote] of Object.entries(results)) {
        const voteInfo = document.createElement('p');
        voteInfo.textContent = `${voter} voted for ${vote}`;
        voteResults.appendChild(voteInfo);
    }
});

