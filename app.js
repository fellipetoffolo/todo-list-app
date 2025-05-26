// ======================= DATA AND CONSTANTS =======================
const STATUS = {
    TODO: "todo",
    DOING: "doing",
    DONE: "done"
};

const date = new Date();
const creation_date = date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const todos = [
    { name: "Passear com o cachorro", creation_date: creation_date, deadline: "12/06/2025", status: STATUS.TODO },
    { name: "Limpar a casa", creation_date: creation_date, deadline: "25/03/2025", status: STATUS.TODO },
    { name: "Lavar o carro", creation_date: creation_date, deadline: "20/03/2003", status: STATUS.TODO }
];

let currentEditingTask = null;

// ======================= DOM ELEMENT REFERENCES =======================
const tableElement = document.getElementById("todo-table");
const modal = document.getElementById("task-modal");
const form = document.getElementById("task-form");
const nameInput = document.getElementById("task-name");
const statusSelect = document.getElementById("task-status");
const deadlineInput = document.getElementById("task-deadline");
const cancelBtn = document.getElementById("cancel-btn");
const selectElement = document.getElementById("list-filter-select");
const navElement = document.getElementById("navbar");

// ======================= RENDERING FUNCTION =======================
function renderTable(todos) {
    tableElement.innerHTML = "";

    todos.forEach(task => {
        const tableRowElement = document.createElement("tr");

        Object.values(task).forEach(field => {
            const tableDataElement = document.createElement("td");
            tableDataElement.textContent = field;
            tableRowElement.appendChild(tableDataElement);
        });

        const buttonTableCell = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit task";
        editBtn.classList.add("task-edit-btn");
        editBtn.task = task;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.id = "task-delete-btn";
        deleteBtn.task = task;

        buttonTableCell.appendChild(editBtn);
        buttonTableCell.appendChild(deleteBtn);

        tableRowElement.appendChild(buttonTableCell);
        tableElement.appendChild(tableRowElement);
    });
}

renderTable(todos); // Initial rendering

// ======================= TABLE EVENT HANDLING =======================
tableElement.addEventListener("click", (event) => {
    const target = event.target;

    if (target.tagName === "TD") {
        const tr = target.closest("tr");
        tr.classList.toggle("done");
    }

    if (target.id === "task-delete-btn") {
        const task = target.task; // referência direta
        const index = todos.indexOf(task);

        if (index !== -1) {
            todos.splice(index, 1);
            renderTable(todos);
        }

        return;
    }


    if (target.classList.contains("task-edit-btn")) {
        const task = target.task;

        currentEditingTask = task;

        nameInput.value = task.name;
        deadlineInput.value = task.deadline;
        statusSelect.value = task.status;
        modal.classList.remove("hidden");
    }
});

// ======================= FORM EVENT HANDLING =======================
document.getElementById("add-task-button").addEventListener("click", () => {
    modal.classList.remove("hidden");
    form.dataset.editing = "";
    form.reset();
});

cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const status = statusSelect.value;
    const deadline = deadlineInput.value;

    if (!name) return alert("O nome da tarefa não pode estar vazio.");

    const newTask = {
        name,
        creation_date,
        deadline,
        status
    };

    if (currentEditingTask) {
        Object.assign(currentEditingTask, newTask);
    } else {
        todos.push(newTask);
    }

    currentEditingTask = null;
    form.reset();
    modal.classList.add("hidden");
    renderTable(todos);
});

// ======================= FILTER SELECT EVENT =======================
selectElement.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    let filteredList = [];

    if (selectedValue === "") {
        filteredList = todos;
    } else {
        filteredList = todos.filter(task => task.status === selectedValue);
    }

    renderTable(filteredList);
});

// ======================= PAGE ROUTING =======================
const routes = {
    "logout-btn": "login",
    "about-btn": "about",
    "profile-btn": "profile"
};

function loadRoute() {
    const route = location.hash.slice(1);
    fetch(`views/${route}.html`)
        .then(response => response.text())
        .then(html => {
            app.innerHTML = html;
        })
        .catch(() => {
            app.innerHTML = "<h2> The page couldn't be found :( </h2>";
        });
}

window.addEventListener("hashchange", loadRoute);

navElement.addEventListener("click", (event) => {
    const route = routes[event.target.id];
    if (route) location.hash = `#${route}`;
});
