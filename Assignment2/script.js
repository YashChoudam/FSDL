document.addEventListener("DOMContentLoaded", () => {
  let todoInput = document.getElementById("todo-input");
  let addTaskButton = document.getElementById("add-task-btn");
  let todoList = document.getElementById("todo-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => renderTask(task));
  addTaskButton.addEventListener("click", () => {
    let taskText = todoInput.value.trim();
    if (taskText === "") return; 

    let newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    tasks.push(newTask);
    saveTask();
    renderTask(newTask);
    todoInput.value = "";
    console.log(tasks);
  });
  function renderTask(task) {
    let li = document.createElement("li");
    li.setAttribute("data-id",task.id);
    li.innerHTML = `
      <span>${task.text}</span>
      <button>delete</button>
    `
    li.addEventListener('click',(e)=>{
        if(e.target.tagName === 'BUTTON') return ;
        task.completed = !task.completed ;
        li.classList.toggle('completed');
        saveTask();
    })
    li.querySelector('button').addEventListener('click',(e)=>{
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      li.remove();
      saveTask();
    })
    
    todoList.appendChild(li); 
  }

  function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

