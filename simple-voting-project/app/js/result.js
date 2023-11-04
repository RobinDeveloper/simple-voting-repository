// /app/js/result.js
const socket = io();

// Socket.io event to update vote counts
socket.on("updateVotes", (updatedVotes) => {
  // Update the UI with the new vote counts
  votes = updatedVotes;
  console.log("Received updated votes:", votes);
  // Display vote counts in a div with id "voteCount"
  document.getElementById("voteCount").innerHTML = `
    <span>Player Left: ${votes.option1}</span>
    <span>Player Left: ${votes.option2}</span>`;
});
