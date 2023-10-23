let activityTime = 0;
let timer = null;
let updateTimer = null; // Variable to handle the update timer

const startTimer = () => {
  timer = setInterval(() => {
    activityTime += 1;
    if (activityTime > 10) {
      // Change the limit to 10 seconds
      showAttractiveAlert(
        "You have been working for 10 seconds. It's time to take a rest."
      );
      clearInterval(timer);
      // Start an update timer to display an updated message
      updateTimer = setInterval(() => {
        showAttractive("Great job! Take a break and refresh.", "green"); // Pass green color
        clearInterval(updateTimer); // Remove the update alert after displaying it once
      }, 5000); // Display the update after 5 seconds
    }
  }, 1000); // 1000ms = 1 second
};

const resetTimer = () => {
  clearInterval(timer);
  clearInterval(updateTimer); // Clear the update timer if it's active
  activityTime = 0;
};

const showAttractiveAlert = (message) => {
  const alertContainer = document.createElement("div");
  alertContainer.style.position = "fixed";
  alertContainer.style.top = "50%";
  alertContainer.style.left = "50%";
  alertContainer.style.transform = "translate(-50%, -50%)";
  alertContainer.style.padding = "20px";
  alertContainer.style.background = "#fff";
  alertContainer.style.color = "#FF6B6B";
  alertContainer.style.borderRadius = "5px";
  alertContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  alertContainer.style.zIndex = "1000";
  alertContainer.innerHTML = message;

  document.body.appendChild(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, 5000); // Remove the alert after 5 seconds
};

const showAttractive = (message, textColor) => {
  const alertContainer = document.createElement("div");
  alertContainer.style.position = "fixed";
  alertContainer.style.top = "50%";
  alertContainer.style.left = "50%";
  alertContainer.style.transform = "translate(-50%, -50%)";
  alertContainer.style.padding = "20px";
  alertContainer.style.background = "#fff";
  alertContainer.style.color = textColor || "#FF6B6B"; // Set the text color, default to red if not provided
  alertContainer.style.borderRadius = "5px";
  alertContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  alertContainer.style.zIndex = "1000";
  alertContainer.innerHTML = message;

  document.body.appendChild(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, 5000); // Remove the alert after 5 seconds
};

export { startTimer, resetTimer };
