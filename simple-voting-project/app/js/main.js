const socket = io();

// Retrieve the 'hasVoted' flag from localStorage
let hasVoted = localStorage.getItem("hasVoted") === "true";

// Function to update the voting interface based on whether the user has voted
function updateVotingInterface(voted) {
  const voteMessageElement = document.getElementById("voteMessage");
  const voteButtonElement = document.getElementById("voteButton");
  // Disable or enable the voting options and button based on the voted parameter
  document.querySelectorAll('input[name="vote"]').forEach((option) => {
    option.disabled = voted;
    option.parentElement.classList.remove("active");
  });
  voteButtonElement.disabled = voted;
  // Display a message if the user has voted
  //voteMessageElement.innerText = voted ? "You voted. Thank you!" : "";
}

// Event listener for the vote button
document.getElementById("voteButton").addEventListener("click", () => {
  if (!hasVoted) {
    const selectedOption = document.querySelector('input[name="vote"]:checked');
    if (selectedOption) {
      const vote = selectedOption.value;
      // Emit the vote to the server
      socket.emit("vote", vote);
      // Set the 'hasVoted' flag in localStorage
      localStorage.setItem("hasVoted", "true");
      hasVoted = true;
      // Update the voting interface
      updateVotingInterface(true);
    } else {
      alert("Please select an option to vote.");
    }
  } else {
    alert("You have already voted.");
  }
});

// Listen for the server to unlock voting
socket.on("votingUnlocked", () => {
  hasVoted = false;
  localStorage.setItem("hasVoted", "false");
  updateVotingInterface(false);
});

// Listen for the server to clear votes
socket.on("clearVotes", () => {
  localStorage.setItem("hasVoted", "false");
  hasVoted = false;
  updateVotingInterface(false);
});

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Update the voting interface based on the current voting state
  updateVotingInterface(hasVoted);

  // Listen for a server restart signal to reset the hasVoted flag
  socket.on("serverRestarted", () => {
    localStorage.removeItem("hasVoted"); // Clear the hasVoted flag from localStorage
    hasVoted = false; // Update local state
    updateVotingInterface(false); // Update the UI to reflect the new state
  });
});
