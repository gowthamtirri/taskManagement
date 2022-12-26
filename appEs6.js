// Adavance Todo app with javascript
// Get date input
const dateInput = document.querySelector('.todo-date');
// Add today date as default
dateInput.valueAsDate = new Date();

let draggedItem;

// Todo class : todo structure or bluprint
class Todo {
    constructor(task,category,date, status){
        this.task = task;
        this.category = category;
        this.date = date;
        this.status = 'todo';
    }

    static changeTodoStatus(draggedItem,todoContainer){
        const status = todoContainer.getAttribute('data-category');
        const todos = LocalStore.getTodos();

        if(status === 'todo'){
            todos.forEach((todo)=>{
                if(draggedItem.children[0].innerText.trim() === todo.task){
                    todo.status = 'todo';
                }
            })
        }
        if(status === 'inprogress'){
            todos.forEach((todo)=>{
                if(draggedItem.children[0].innerText.trim() === todo.task){
                    todo.status = 'inprogress';
                }
            })
        }
        if(status === 'done'){
            todos.forEach((todo)=>{
                if(draggedItem.children[0].innerText.trim() === todo.task){
                    todo.status = 'done';
                }
            })
        }
        localStorage.setItem('todos',JSON.stringify(todos))

    }
}
class DragNdrop{
   static dragDrop(){
        this.prepend(draggedItem)
    
        // change todo status
        const todoContainer = this;
        Todo.changeTodoStatus(draggedItem, todoContainer);

         // display trash  bin
         const trashBin = document.querySelector('.trash-bin');
         trashBin.style.display ='none';

        //  Update stats when a todo status is changed
        Stats.callStats()
    }
    static dragEnter(e){
        e.preventDefault();
    }
    static dragOver(e){
        e.preventDefault();
    }
    static dragLeave(){
        
    }

    static dragStart(){
        // display trash  bin
        const trashBin = document.querySelector('.trash-bin');
        trashBin.style.display ='flex';

        draggedItem = this;
        setTimeout(() => {
            this.style.display = 'none';
        }, 0);
}

static dragEnd(){
    setTimeout(() => {
        this.style.display = 'block';
    }, 0);
    draggedItem = null;
}
}

// UI class : handles all UI functionalities
class UI {

    // Default input date as Today
    addTaskToUi(todo){
        const todoList = document.querySelector('#todo-list');
        const inprogressList = document.querySelector('#inprogress-list');
        const doneList = document.querySelector('#done-list');

        // Create todo div
        const todoDiv = document.createElement('div');
        todoDiv.className = 'todo-div ' + todo.category
        todoDiv.setAttribute('draggable',"true")

        todoDiv.innerHTML = `
                <div  class="title">
                <p>${todo.task}</p>
                </div>
                <hr>
                <div class="details">
                    <p class="category" >${todo.category}</p>
                    <p class="todo-date"> <i class="fa fa-calendar"></i> ${todo.date}</p>
                </div>
        `
      
        // Display todo by Status
        if(todo.status === 'todo'){
            todoList.prepend(todoDiv);
        }
        if(todo.status === 'inprogress'){
            inprogressList.prepend(todoDiv);
        }
        if(todo.status === 'done'){
            doneList.prepend(todoDiv);
        }
        //add Event listener for drag and drop
        todoDiv.addEventListener('dragstart', DragNdrop.dragStart);
        todoDiv.addEventListener('dragend', DragNdrop.dragEnd);

        // Display todo only if category matches to acitve nav 
        const activeNav = document.querySelector('.nav-active').getAttribute('data-value')
        if(todoDiv.classList.contains(activeNav) || activeNav === 'alltasks')  {
            todoDiv.style.display = 'flex';
        }
        else {
            todoDiv.style.display ='none';
        }
    };

    static deleteTodo(){
        trashBin.style.display = 'none'
        draggedItem.remove()
        LocalStore.deleteFromLocal(draggedItem)

        // show deleted message
        const ui = new UI();

        ui.showAlert('Todo has been deleted', 'fa fa-trash', 'deleted-msg')
    }

    // Change colors of category tag for tasks
    categoryColors(category){
        const todoCategory = document.querySelector('.category')
        if(category==='work'){
            todoCategory.className = 'work-tag'
        }
        if(category==='learn'){
            todoCategory.className = 'learn-tag'
        }
        if(category==='design'){
            todoCategory.className = 'design-tag'
        }
        if(category==='personal'){
            todoCategory.className = 'personal-tag'
        }
        if(category==='business'){
            todoCategory.className = 'business-tag'
        }
    };

    clearFields(){
        document.querySelector('.todo-input').value = '';
        document.querySelector('.todo-category').value = '';
    };

    showAlert(message, icon, className){
        const alertMsgDiv = document.createElement('div')
        alertMsgDiv.className = 'alert-msg ' + className;

        alertMsgDiv.innerHTML = `
            <p> <i class="fa ${icon}"></i> ${message}</p>
        `
        // Get DOM element to append alert msg
        const header = document.querySelector('.header');
        header.appendChild(alertMsgDiv);

        setTimeout(() => {
            document.querySelector('.alert-msg').remove();
        }, 3000);
    };

    // Active nav item
    activeNav(e){
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(navItem => {
            if(navItem === e){
                navItem.classList.add('nav-active');
            }else {
                navItem.classList.remove('nav-active');
            }
        })
    }
 

    // Filter categories
    filterCategories(e){
        let navCategory = e.target.getAttribute('data-value')

        const allTasks = document.querySelectorAll('.todo-div');
        allTasks.forEach(function(task) {
           if(task.classList.contains(navCategory) || navCategory === 'alltasks'){
               task.style.display = 'flex';
           }
           else {
               task.style.display = 'none';
           }
        })
    }

    // Filter todo's
    static search(searchQuery){
        const todos = document.querySelectorAll('.todo-div')

        todos.forEach(todo => {
            const todoTask = todo.children[0].innerText.trim().toLowerCase()
            const activeNav = document.querySelector('.nav-active').getAttribute('data-value')
            if(todoTask.includes(searchQuery)){
                // search only active nav items
                if(todo.classList.contains(activeNav) || activeNav === 'alltasks'){
                    todo.style.display = 'flex';
                }
                else {
                    todo.style.display = 'none';
                }
            } else {
                todo.style.display = 'none';
            }
        })
    }
}


// Local storage class
class LocalStore{
    static getTodos(){
        let todos;
        if(localStorage.getItem('todos') === null){
            todos = [];
        }else{
            todos = JSON.parse(localStorage.getItem('todos'))
        }

        return todos;
    }
    
    static displayTodo(){

        const todos = LocalStore.getTodos();
        const ui = new UI();
        
        todos.forEach(todo => {
            ui.addTaskToUi(todo);
            ui.categoryColors(todo.category)
        })
        // Update Stats when reloaded
        Stats.callStats()
    }

    static addTodo(todo){
        
        const todos = LocalStore.getTodos();
        
        todos.push(todo);

        localStorage.setItem('todos', JSON.stringify(todos))
        // Update stats when new todo is created
        Stats.callStats()
    }

    static deleteFromLocal(draggedItem){
        const todos = LocalStore.getTodos()

        todos.forEach((todo,index )=>{
            if(draggedItem.children[0].innerText.trim() === todo.task){
                todos.splice(index, 1);
            }
        })
        localStorage.setItem('todos', JSON.stringify(todos));
        // Update Stats when a todo is deleted
        Stats.callStats()
    }

    // Save todo with status
}

// Class stats
class Stats{
    static allTasks(){
        let allTasksCount= 0;
        const todos = LocalStore.getTodos()
        todos.forEach(todo=>{
            allTasksCount++;
        })
        const allTasks = document.querySelectorAll('.all-tasks');
        allTasks.forEach(task =>{
            task.innerText = allTasksCount;
        })
       
        return allTasksCount;
    }

    static completedTasks(){
        let completedTasksCount= 0;
        const todos = LocalStore.getTodos()
        todos.forEach(todo=>{
            if(todo.status === 'done'){
                completedTasksCount++;
            }
        })
        const completedTasks = document.querySelectorAll('.completed-tasks');
        completedTasks.forEach(task =>{
            task.innerText = completedTasksCount;
        })
        return completedTasksCount;
    }

    static inprogressTasks(){
        let inprogressTasksCount= 0;
        const todos = LocalStore.getTodos()
        todos.forEach(todo=>{
            if(todo.status === 'inprogress'){
                inprogressTasksCount++;
            }
        })
        const inprogressTasks = document.querySelectorAll('.inprogres-tasks');
        inprogressTasks.forEach(task =>{
            task.innerText = inprogressTasksCount;
        })
        return inprogressTasksCount;
    }
    static todoTasks(){
        let todoTasksCount= 0;
        const todos = LocalStore.getTodos()
        todos.forEach(todo=>{
            if(todo.status === 'todo'){
                todoTasksCount++;
            }
        })
        const todoTasks = document.querySelectorAll('.pending-tasks');
        todoTasks.forEach(task =>{
            task.innerText = todoTasksCount;
        })
        return todoTasksCount;
    }

    static progressBar(){
        const total = this.allTasks();
        const completed = this.completedTasks()

        let progressDone = 100 * completed/total;

      // Progress bar
        const progress = document.querySelector('.progress-done');

        progress.style.width = progressDone + '%';
        progress.style.opacity = 1;
    }

    static callStats(){
        this.allTasks();
        this.todoTasks();
        this.completedTasks();
        this.progressBar();
        this.inprogressTasks();

        // Progress bar completed by total stats
        const progressBar = document.querySelector('.progress-done-num');
        progressBar.innerText =  this.completedTasks() + "/" + this.allTasks()
    }
}
// ============= Event listeners ==================

// New todo form submit : Create new todo 
document.querySelector('.create-todo-form').addEventListener('submit', (e)=>{
    // prevent default
    e.preventDefault();
    
    // Get form values
    const task = document.querySelector('.todo-input').value,
          category = document.querySelector('.todo-category').value,
          date = document.querySelector('.todo-date').value

    // Instantiate new todo
    const todo = new Todo(task, category, date);
    // Instantiate new ui
    const ui = new UI();

    // Alert message
    if(task === '' || category === '' || date === ''){
        ui.showAlert("Fill in all the detaills",'fa-exclamation-triangle', 'error-msg');
    }
    else {
        // Add task to ui
        ui.addTaskToUi(todo);

        // Add todo to local storage
        LocalStore.addTodo(todo)

        // Change category colors
        ui.categoryColors(category);
 
        // clear input fields
        // ui.clearFields();
        
        // Show success mesage
        ui.showAlert('Task added sucessfully','fa-check-circle', 'success-msg')
    }           
})

// Search todo's Event listener
document.querySelector('.search-input').addEventListener('keyup', (e)=>{
    searchQuery = e.target.value.toLowerCase()

    // Call search function
    UI.search(searchQuery);
    e.preventDefault()
})

// Filter categories Event listener
document.querySelector('.nav-list').addEventListener('click', (e) =>{
    const ui = new UI();

    // filter tasks
    ui.filterCategories(e);

    // Active nav item
    ui.activeNav(e.target);
})


// Display todos on local storage
document.addEventListener('DOMContentLoaded', LocalStore.displayTodo)


        
// Drag and drop event listeners
const containers = document.querySelectorAll('.todo-list');
const trashBin = document.querySelector('.trash-bin')

trashBin.addEventListener('dragenter', DragNdrop.dragEnter);
trashBin.addEventListener('dragover', DragNdrop.dragOver);
trashBin.addEventListener('drop', UI.deleteTodo)

for(container of containers){
    container.addEventListener('drop', DragNdrop.dragDrop);
    container.addEventListener('dragover', DragNdrop.dragOver);
    container.addEventListener('dragenter', DragNdrop.dragEnter);
    container.addEventListener('dragleave', DragNdrop.dragLeave);
};



// ============= Dark Mode ===============
const body  = document.querySelector('body')

window.addEventListener('load', ()=>{
    body.classList.remove('dark')

    if(localStorage.getItem('dark')){
        body.classList.add('dark')
    }
})
const themeToggleBtn = document.querySelector('.theme-toggle');
themeToggleBtn.addEventListener('click', ()=>{
    if(localStorage.getItem('dark')){
        body.classList.remove('dark')
        localStorage.removeItem('dark')
    }
    else  {
        body.classList.add('dark')
        localStorage.setItem('dark', JSON.stringify('dark'))
    }
})