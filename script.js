document.addEventListener("DOMContentLoaded", () => {
  // --------------- Dashboard/Home Page Code ----------------
  if (document.getElementById("totalGoals")) {
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const total = goals.length;
    const completed = goals.filter(goal => goal.completed).length;
    const pending = total - completed;

    // Animate numbers using a simple increment effect
    animateValue("totalGoals", total);
    animateValue("completedGoals", completed);
    animateValue("pendingGoals", pending);

    // Populate the recent goals list (limit to 5)
    const goalList = document.getElementById("goalList");
    goals.slice(0, 5).forEach((goal) => {
      const li = document.createElement("li");
      li.textContent = goal.title + (goal.completed ? " ✅" : "");
      li.addEventListener("click", () => {
        alert(`Goal Details:\nTitle: ${goal.title}\nDescription: ${goal.description || 'No description provided.'}`);
      });
      goalList.appendChild(li);
    });
  }

  // --------------- Add Goal Page Code ----------------
  const goalForm = document.getElementById("goalForm");
  if (goalForm) {
    goalForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();
      const targetDate = document.getElementById("targetDate").value;
      const priority = document.getElementById("priority").value;

      // Create a new goal object.
      const newGoal = {
        id: Date.now(),
        title,
        description,
        targetDate,
        priority,
        completed: false
      };
      const goals = JSON.parse(localStorage.getItem("goals")) || [];
      goals.push(newGoal);
      localStorage.setItem("goals", JSON.stringify(goals));

      window.location.href = "home.html";
    });
  }
});

function animateValue(id, endValue) {
  const element = document.getElementById(id);
  if (!element) return;
  
  let startValue = 0;
  const duration = 1000;
  const incrementTime = 50;
  if (endValue === 0) {
    element.textContent = 0;
    return;
  }

  // stepTime is calculated but not used. You can remove it if not required.
  const stepTime = Math.abs(Math.floor(duration / endValue));
  
  const timer = setInterval(() => {
    startValue += Math.ceil(endValue / (duration / incrementTime));
    if (startValue >= endValue) {
      element.textContent = endValue;
      clearInterval(timer);
    } else {
      element.textContent = startValue;
    }
  }, incrementTime);
}

// --------------- Goal Details Page Code ----------------

// Utility function to get query parameter values
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", () => {
  // Only run the goal-details logic if "goalContainer" is present.
  const goalContainer = document.getElementById("goalContainer");
  if (!goalContainer) return;

  const goalId = getQueryParam("id");
  if (!goalId) {
    goalContainer.textContent =
      "No goal specified. Please go back and select a goal from your dashboard.";
    hideActionButtons();
    return;
  }
  
  // Retrieve goals from localStorage and find the specific goal.
  const goals = JSON.parse(localStorage.getItem("goals")) || [];
  const goal = goals.find(g => g.id == goalId);
  
  if (!goal) {
    goalContainer.textContent =
      "Goal not found. It might have been removed.";
    hideActionButtons();
    return;
  }
  
  // Populate goal details
  goalContainer.innerHTML = `
    <h2>${goal.title}</h2>
    <p><strong>Description:</strong> ${goal.description || "No description provided."}</p>
    <p><strong>Target Date:</strong> ${goal.targetDate}</p>
    <p><strong>Priority:</strong> ${goal.priority}</p>
    <p><strong>Status:</strong> ${goal.completed ? "Completed" : "In Progress"}</p>
  `;
  
  // Hide the "Mark as Complete" button if already complete.
  const markCompleteBtn = document.getElementById("markCompleteBtn");
  if (goal.completed && markCompleteBtn) {
    markCompleteBtn.style.display = "none";
  }
  
  // Set up the "Mark as Complete" click handler.
  if (markCompleteBtn) {
    markCompleteBtn.addEventListener("click", () => {
      goal.completed = true;
      const updatedGoals = goals.map(g => g.id == goal.id ? goal : g);
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      alert("Goal marked as complete!");
      location.reload(); // Refresh to update the display.
    });
  }

  // Calculate and display progress chart.
  // Use the goal's id as the creation timestamp.
  const creationDate = new Date(Number(goal.id));
  const targetDate = new Date(goal.targetDate);
  const now = new Date();
  
  let progressPercentage = 0;
  if (goal.completed) {
    progressPercentage = 100;
  } else if (now < creationDate) {
    progressPercentage = 0;
  } else {
    const totalDuration = targetDate - creationDate;
    const elapsed = now - creationDate;
    progressPercentage = Math.min(Math.round((elapsed / totalDuration) * 100), 100);
  }

  // Render a doughnut chart using Chart.js.
  // Ensure the canvas with id "progressChart" exists.
  const progressChartElem = document.getElementById("progressChart");
  if (progressChartElem) {
    const ctx = progressChartElem.getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Progress", "Remaining"],
        datasets: [{
          data: [progressPercentage, 100 - progressPercentage],
          backgroundColor: [ "#4caf50", "#e0e0e0"],
          hoverBackgroundColor: [ "#43a047", "#d5d5d5"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: context => `${context.label}: ${context.parsed} %`
            }
          },
          legend: {
            display: true,
            position: "bottom",
          }
        }
      }
    });
  }
});

/**
 * Redirect to the edit page.
 */
function editGoal() {
  const goalId = getQueryParam("id");
  window.location.href = `edit.html?id=${goalId}`;
}

/**
 * Hide the action buttons (for cases where no goal is found).
 */
function hideActionButtons() {
  const markBtn = document.getElementById("markCompleteBtn");
  const editBtn = document.getElementById("editGoalBtn");
  if (markBtn) markBtn.style.display = "none";
  if (editBtn) editBtn.style.display = "none";
                          }
