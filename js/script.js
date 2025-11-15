document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todoInput');
    const dateInput = document.getElementById('dateInput');
    const todoList = document.getElementById('todoList');
    const statusFilter = document.getElementById('statusFilter');

    let todos = [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const data = localStorage.getItem('todos');
        if (data) {
            todos = JSON.parse(data);
        }
    }

    function renderTodos(filter = "all") {
        todoList.innerHTML = "";

        let filteredTodos = todos;

        if (filter === "completed") {
            filteredTodos = todos.filter(todo => todo.completed);
        } else if (filter === "incomplete") {
            filteredTodos = todos.filter(todo => !todo.completed);
        }

        if (filteredTodos.length === 0) {
            const noTaskRow = document.createElement('tr');
            noTaskRow.innerHTML = `<td colspan="4" class="no-task">No Task Found!</td>`;
            todoList.appendChild(noTaskRow);
            return;
        }

        filteredTodos.forEach((todo, index) => {
            const row = document.createElement('tr');

            // Task cell
            const taskCell = document.createElement('td');
            taskCell.textContent = todo.task;
            if (todo.completed) {
                taskCell.classList.add('completed-task');
            }

            // Date cell
            const dateCell = document.createElement('td');
            dateCell.textContent = todo.date;

            // Status cell (checkbox)
            const statusCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.classList.add('status-checkbox');
            checkbox.addEventListener('change', () => {
                todos[index].completed = checkbox.checked;
                saveTodos();
                renderTodos(statusFilter.value);
            });
            statusCell.appendChild(checkbox);

            // Action cell (delete button)
            const actionCell = document.createElement('td');
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.classList.add('action-btn');
            delBtn.addEventListener('click', () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos(statusFilter.value);
            });
            actionCell.appendChild(delBtn);

            row.appendChild(taskCell);
            row.appendChild(dateCell);
            row.appendChild(statusCell);
            row.appendChild(actionCell);

            todoList.appendChild(row);
        });
    }

    todoForm.addEventListener('submit', e => {
        e.preventDefault();

        const task = todoInput.value.trim();
        const date = dateInput.value;

        if (!task) {
            alert('Please enter a task.');
            return;
        }
        if (!date) {
            alert('Please enter a valid date.');
            return;
        }

        todos.push({
            task,
            date,
            completed: false
        });

        saveTodos();
        renderTodos(statusFilter.value);

        todoInput.value = '';
        dateInput.value = '';
    });

    statusFilter.addEventListener('change', () => renderTodos(statusFilter.value));

    loadTodos();
    renderTodos();
});