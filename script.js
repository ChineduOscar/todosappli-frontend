const form = document.getElementById('todo-form');
const description = document.getElementById('description');
const input = document.getElementById('title');
const todoList = document.getElementById('todo-list');

const API_URL = 'http://localhost:3000/todos';


// =========================
// GET ALL TODOS
// =========================
async function getAllTodos() {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) {
            throw new Error("Failed to fetch todos");
        }

        const todos = await res.json();

        // IMPORTANT: clear old list to avoid duplicates
        todoList.innerHTML = "";

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.classList.add("todo-item");

            if (todo.completed) {
                li.classList.add("completed");
            }

            li.innerHTML = `
                <div>
                    <span><strong>${todo.title}</strong></span>
                    <p style="margin:0; font-size: 0.8rem; color: #666;">
                        ${todo.description || ''}
                    </p>

                    <div class="actions">
                        <button onclick="toggleTodo('${todo._id}', ${todo.completed})">
                            ${todo.completed ? 'Undo' : 'Done'}
                        </button>

                        <button class="delete-btn" onclick="deleteTodo('${todo._id}')">
                            Delete
                        </button>
                    </div>
                </div>
            `;

            todoList.appendChild(li);
        });

    } catch (error) {
        console.log(error.message);
    }
}


// =========================
// CREATE TODO
// =========================
form.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                title: input.value,
                description: description.value
            })
        });

        const body = await res.json();
        console.log(body);

        form.reset();

        getAllTodos();

    } catch (error) {
        console.log(error.message);
    }
}


// =========================
// TOGGLE TODO (DONE / UNDONE)
// =========================
async function toggleTodo(id, currentStatus) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completed: !currentStatus
            })
        });

        getAllTodos(); // refresh UI

    } catch (error) {
        console.log(error.message);
    }
}


// =========================
// DELETE TODO
// =========================
async function deleteTodo(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        getAllTodos(); // refresh UI

    } catch (error) {
        console.log(error.message);
    }
}


// =========================
// INITIAL LOAD
// =========================
getAllTodos();