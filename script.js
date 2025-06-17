document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskText');
    const taskDateInput = document.getElementById('taskDate');
    const taskTimeInput = document.getElementById('taskTime');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) {
                li.classList.add('completed');
            }

            li.innerHTML = `
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    ${task.date || task.time ? `<span class="task-datetime">${task.date || ''} ${task.time || ''}</span>` : ''}
                </div>
                <div class="actions">
                    <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            // Event Listeners for actions
            li.querySelector('.complete-btn').addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            li.querySelector('.edit-btn').addEventListener('click', () => {
                if (li.classList.contains('editing')) {
                    // Save the edited task
                    const editedText = li.querySelector('.edit-input').value;
                    tasks[index].text = editedText;
                    saveTasks();
                    renderTasks();
                } else {
                    // Enter edit mode
                    li.classList.add('editing');
                    const currentTextSpan = li.querySelector('.task-text');
                    const currentText = currentTextSpan.textContent;
                    const editInput = document.createElement('input');
                    editInput.type = 'text';
                    editInput.className = 'edit-input';
                    editInput.value = currentText;

                    li.querySelector('.task-content').replaceChild(editInput, currentTextSpan);
                    li.querySelector('.edit-btn').textContent = 'Save';

                    editInput.focus();
                    editInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            const editedText = editInput.value;
                            tasks[index].text = editedText;
                            saveTasks();
                            renderTasks();
                        }
                    });
                }
            });

            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);
        });
    }

    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const date = taskDateInput.value;
        const time = taskTimeInput.value;

        if (text) {
            tasks.push({ text: text, completed: false, date: date, time: time });
            saveTasks();
            renderTasks();
            taskInput.value = '';
            taskDateInput.value = '';
            taskTimeInput.value = '';
        }
    });

    // Allow adding tasks with Enter key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    renderTasks(); // Initial render when the page loads
});