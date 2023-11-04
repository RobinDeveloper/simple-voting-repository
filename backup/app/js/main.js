const socket = io();

let isVotingLocked = true; // Initialize the variable for voting lock state

// Check if a vote has been cast
const hasVoted = localStorage.getItem('hasVoted') === 'true';

// Function to handle voting
document.getElementById('voteButton').addEventListener('click', () => {
    if (!isVotingLocked) { // Check if the voting system is unlocked
        const selectedOption = document.querySelector('input[name="vote"]:checked');
        if (selectedOption) {
            const vote = selectedOption.value;

            // Disable voting options after voting
            document.querySelectorAll('input[name="vote"]').forEach(option => {
                option.disabled = true;
            });

            // Display "You voted" message
            document.getElementById('voteMessage').innerText = 'You voted. Thank you!';

            // Inform the server about the vote
            socket.emit('vote', vote);

            // Save the voting status locally
            localStorage.setItem('hasVoted', 'true');
        } else {
            alert('Please select an option to vote.');
        }
    } else {
        alert('Voting is currently locked.');
    }
});

// Socket.io event to update vote counts
socket.on('updateVotes', (updatedVotes) => {
    // Update the UI with the new vote counts
    votes = updatedVotes;
    console.log('Received updated votes:', votes);
    // Display vote counts in a div with id "voteCount"
    document.getElementById('voteCount').innerText = `Option 1: ${votes.option1}, Option 2: ${votes.option2}`;
});

// Lock or unlock the voting system based on the voting state
if (hasVoted || isVotingLocked) {
    // If the user has voted or the voting is locked, disable voting options
    document.querySelectorAll('input[name="vote"]').forEach(option => {
        option.disabled = true;
    });

    // Display "You voted" message if the user has already voted
    if (hasVoted) {
        document.getElementById('voteMessage').innerText = 'You voted. Thank you!';
    }
}

// Listen for an event from the server to unlock the voting system
socket.on('votingUnlocked', () => {
    isVotingLocked = false; // Update the voting lock state
    // Enable the voting options
    document.querySelectorAll('input[name="vote"]').forEach(option => {
        option.disabled = false;
    });
});

