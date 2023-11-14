document.addEventListener('DOMContentLoaded', function () {
    // Відновлення списку з localStorage при завантаженні сторінки
    restoreTaskList();

    // Додаємо обробник події для збереження задач у localStorage при закритті вікна
    window.addEventListener('beforeunload', function () {
        saveTaskList();
    });

    // Ініціалізація сортування за допомогою drag-n-drop
    new Sortable(document.getElementById('taskList'), {
        animation: 150,
        store: {
            // Зберігання порядку елементів у localStorage
            set: function (sortable) {
                saveTaskOrder(sortable.toArray());
            },

            // Відновлення порядку елементів із localStorage
            get: function (sortable) {
                return JSON.parse(localStorage.getItem('taskOrder')) || [];
            },
        },
    });
});

function addTask() {
    var taskInput = document.getElementById('taskInput');
    var taskList = document.getElementById('taskList');

    if (taskInput.value.trim() === '') {
        alert('Please enter a task.');
        return;
    }

    var taskText = taskInput.value.trim();

    // Створення нового елемента списку
    var newTask = document.createElement('li');
    newTask.textContent = taskText;

    // Додаємо хрестик для видалення завдання
    var deleteButton = document.createElement('span');
    deleteButton.textContent = ' ❌';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function () {
        taskList.removeChild(newTask);
        saveTaskList();
    });

    newTask.appendChild(deleteButton);

    // Додаємо новий елемент у список
    taskList.appendChild(newTask);

    // Очищаємо поле вводу
    taskInput.value = '';

    // Зберігаємо актуальний список у localStorage
    saveTaskList();
}

function saveTaskList() {
    var taskList = document.getElementById('taskList');
    var tasks = [];

    // Зберігаємо тексти завдань у масив
    for (var i = 0; i < taskList.children.length; i++) {
        tasks.push(taskList.children[i].textContent);
    }

    // Зберігаємо масив у localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveTaskOrder(order) {
    // Зберігаємо порядок елементів у localStorage
    localStorage.setItem('taskOrder', JSON.stringify(order));
}

function restoreTaskList() {
    var taskList = document.getElementById('taskList');
    var storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        // Відновлюємо список, якщо є збережені завдання
        var tasks = JSON.parse(storedTasks);

        tasks.forEach(function (taskText) {
            var newTask = document.createElement('li');
            newTask.textContent = taskText;

            // Додаємо хрестик для видалення завдання
            var deleteButton = document.createElement('span');
            deleteButton.textContent = ' ❌';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', function () {
                taskList.removeChild(newTask);
                saveTaskList();
            });

            newTask.appendChild(deleteButton);

            taskList.appendChild(newTask);
        });
    }
}
