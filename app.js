// Placeholder values for testing when no database
const todos = [
    "Passear com o cachorro",
    "Limpar a casa",
    "Lavar o carro"
];

// Retrieves the task list from the DOM
const listElement = document.getElementById("todo-list");

// Recieves a list and renders it on the page. Accepts parameter for reusability when filtering the content.
function renderList(todos) {
    
    listElement.innerHTML = "";
    
    todos.forEach(task => {
        const listItem = document.createElement("li");
        const spanElement = document.createElement("span");     // Creates a span, because otherwise the click event would text-decorate the delete button alongside the todo text.
        spanElement.textContent = task;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("task-delete-btn");          // Adds a class to make the delete butons searchable (for deleting).
        listItem.appendChild(spanElement);
        listItem.appendChild(deleteButton);

        listElement.appendChild(listItem);
    })
}

renderList(todos);  // Displays the list when the page first loads.

// Event listener for marking the tasks as done.
listElement.addEventListener("click", (event) => {
    if(event.target.tagName === "SPAN") {           // Checks if the target element is a Span tag.
        console.log(event);
        event.target.classList.toggle("completed"); // Toggles the "completed" CSS class, text-decorating with line-through.
        return ;    // Make it so that the second condition is not checked, as it is not needed.
    }

    if(event.target.classList.contains("task-delete-btn")) {
        const li = event.target.parentElement;
        li.remove();
        
        const index = Array.from(listElement.children).indexOf(li);
        todos.splice(index, 1);
    }
})

const inputElement = document.getElementById("new-task-input");
const buttonElement = document.getElementById("add-task-button");

// Event listener for adding a new task and re-rendering the list.
buttonElement.addEventListener("click", (event) => {
    const newTask = inputElement.value.trim();
    if(newTask){
        todos.push(newTask);
        inputElement.value = "";
        renderList(todos);
    }
})


// ***TODO: Implement filtering logic for when the task structure is more complex.
const selectElement = document.getElementById("list-filter-select");

selectElement.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
})


// Routing logic for rendering other page's html content without reloading anything
const routes = {
    "logout-btn": "login",
    "about-btn": "about",
    "profile-btn": "profile"
}

function loadRoute() {
    const route = location.hash.slice(1);
    fetch(`views/${route}.html`)
        .then(response => response.text())
        .then(html => {
            app.innerHTML = html;
        })
        .catch(() => {
            app.innerHTML= "<h2> The page couldn't be found :( </h2>"
        })
}

window.addEventListener("hashchange", loadRoute);

const navElement = document.getElementById("navbar")

navElement.addEventListener("click", (event) => {
    const route = routes[event.target.id];
    if (route) location.hash = `#${route}`;
});

