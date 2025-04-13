document.addEventListener("DOMContentLoaded", () => {
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