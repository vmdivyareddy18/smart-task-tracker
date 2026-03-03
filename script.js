let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const clearAll = document.getElementById("clearAll");
const message = document.getElementById("message");
const sound = document.getElementById("completeSound");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    let text = taskInput.value.trim();
    let dueDate = dueDateInput.value;

    if (text === "") {
        message.textContent = "Please enter a task!";
        return;
    }

    tasks.push({
        text: text,
        dueDate: dueDate,
        completed: false
    });

    taskInput.value = "";
    dueDateInput.value = "";
    message.textContent = "";

    saveTasks();
    displayTasks();
}

function updateProgress() {
    let completedCount = tasks.filter(t => t.completed).length;
    let percent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    progressBar.style.width = percent + "%";
    progressText.textContent = percent + "% Completed";
}

function displayTasks() {
    taskList.innerHTML = "";

    let today = new Date().toISOString().split("T")[0];

    tasks.forEach((task, index) => {

        let li = document.createElement("li");

        if (!task.completed && task.dueDate && task.dueDate < today) {
            li.classList.add("overdue");
        }

        let row = document.createElement("div");
        row.classList.add("task-row");

        let span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        span.onclick = function () {
            tasks[index].completed = !tasks[index].completed;
            if (tasks[index].completed) {
                sound.play();
            }
            saveTasks();
            displayTasks();
        };

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        };

        row.appendChild(span);
        row.appendChild(deleteBtn);

        li.appendChild(row);

        if (task.dueDate) {
            let dateText = document.createElement("small");
            dateText.textContent = "Due: " + task.dueDate;
            li.appendChild(dateText);
        }

        taskList.appendChild(li);
    });

    updateProgress();

    // Reminder Alert
    tasks.forEach(task => {
        if (!task.completed && task.dueDate === today) {
            alert("Reminder: You have a task due today!");
        }
    });
}

clearAll.addEventListener("click", function () {
    tasks = [];
    saveTasks();
    displayTasks();
});

addBtn.addEventListener("click", addTask);

displayTasks();