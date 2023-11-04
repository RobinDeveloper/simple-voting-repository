const socket = io();

// Initial state of the button
let isResetAvailable = true;

// Function to toggle the reset button state
function toggleResetButton(state) {
  const resetButton = document.getElementById("resetVotingButton");
  if (resetButton) {
    resetButton.disabled = !state;
  }
}

// Event listener for the reset button
const resetButtonElement = document.getElementById("resetVotingButton");
if (resetButtonElement) {
  resetButtonElement.addEventListener("click", () => {
    if (isResetAvailable) {
      socket.emit("unlockVoting");
    } else {
      console.log("Reset not available yet.");
    }
  });
}


// Listening for the 'resetComplete' event from server to disable the button
socket.on("resetComplete", () => {
  isResetAvailable = false;
  toggleResetButton(isResetAvailable);
  console.log("Voting reset complete.");
});

// Listening for the 'allVoted' event from server to enable the button
socket.on("allVoted", () => {
  isResetAvailable = true;
  toggleResetButton(isResetAvailable);
  console.log("All users have voted. You can now reset the votes.");
});

// Initial setup to disable the button on load
toggleResetButton(isResetAvailable);
