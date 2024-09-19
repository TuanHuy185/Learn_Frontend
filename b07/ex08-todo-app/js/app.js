document.addEventListener('DOMContentLoaded', () => {
  const elTodoList = document.querySelector('.todo-list');
  const elTodoInput = document.querySelector('.input-todo');
  const elCreateButton = document.querySelector('.form-todo button');
  const elSearchBtn = document.querySelector('.btn-search');
  const elSearchInput = document.querySelector('.input-search');
  const elClearButton = document.querySelector('.btn-clear');
  const elCancelButton = document.querySelector('.form-todo .bg-warning');
  const elSortDefaultButton = document.querySelector('.sort-area .btn');
  const elSortAscButton = document.querySelector('.sort-area .bg-primary');
  const elSortDescButton = document.querySelector('.sort-area .bg-success');

  let TODO_LIST = JSON.parse(localStorage.getItem('TODO_LIST')) || [
    'Complete JavaScript course', 
    'Record video', 
    'Learning', 
    'Reading Book', 
    'GYM', 
    'Laragon Guide'
  ];
  let EDITING_TODO_LIST = [...TODO_LIST];
  let editingTodo = null;

  elCreateButton.addEventListener('click', addTodo);
  elCancelButton.addEventListener('click', cancelToDoInput);
  elSearchBtn.addEventListener('click', searchTodos);
  elClearButton.addEventListener('click', () => {
    elSearchInput.value = '';
    searchTodos();
  });

  elSortDefaultButton.addEventListener('click', () => sortTodos('default'));
  elSortAscButton.addEventListener('click', () => sortTodos('asc'));
  elSortDescButton.addEventListener('click', () => sortTodos('desc'));

  elTodoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('bg-danger')) deleteTodo(e);
    if (e.target.classList.contains('bg-warning')) editTodo(e);
  });

  loadTodos();

  function loadTodos(todoList = EDITING_TODO_LIST) {
    elTodoList.innerHTML = '';
    todoList.forEach(todo => {
      const todoItem = document.createElement('div');
      todoItem.className = 'todo-item';
      todoItem.innerHTML = `
        <span class="todo-name">${todo}</span>
        <div class="todo-action">
          <button class="btn bg-warning" aria-label="Edit">Edit</button>
          <button class="btn bg-danger" aria-label="Delete">Delete</button>
        </div>
      `;
      elTodoList.appendChild(todoItem);
    });
  }

  function sortTodos(order) {
    let sortedTodos = [...EDITING_TODO_LIST];
    if (order === 'asc') {
      sortedTodos.sort((a, b) => a.localeCompare(b));
    } else if (order === 'desc') {
      sortedTodos.sort((a, b) => b.localeCompare(a));
    }
    loadTodos(sortedTodos);
  }

  function searchTodos() {
    const searchTerm = elSearchInput.value.toLowerCase();
    EDITING_TODO_LIST = TODO_LIST.filter(todo =>
      todo.toLowerCase().includes(searchTerm)
    );
    loadTodos(EDITING_TODO_LIST);
  }

  function addTodo() {
    const newTodo = elTodoInput.value.trim();
    if (newTodo) {
      if (editingTodo) {
        TODO_LIST = TODO_LIST.map(todo => todo === editingTodo ? newTodo : todo);
        editingTodo = null;
      } else {
        TODO_LIST.unshift(newTodo);
        EDITING_TODO_LIST.unshift(newTodo)
      }
      localStorage.setItem('TODO_LIST', JSON.stringify(TODO_LIST));
      loadTodos();
      cancelToDoInput();
    }
  }

  function cancelToDoInput() {
    elTodoInput.value = '';
    editingTodo = null;
  }

  function deleteTodo(e) {
    if (confirm('Agree to delete this todo?')) {
      const todoItem = e.target.closest('.todo-item');
      const todoName = todoItem.querySelector('.todo-name').textContent;
      TODO_LIST = TODO_LIST.filter(todo => todo !== todoName);
      EDITING_TODO_LIST = EDITING_TODO_LIST.filter(todo => todo !== todoName);
      localStorage.setItem('TODO_LIST', JSON.stringify(TODO_LIST));
      loadTodos(EDITING_TODO_LIST);
    }
  }

  function editTodo(e) {
    const todoItem = e.target.closest('.todo-item');
    const todoName = todoItem.querySelector('.todo-name').textContent;
    elTodoInput.value = todoName;
    editingTodo = todoName;
  }
});
