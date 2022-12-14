class Task {

    constructor(title, duedate=null, status="backlog") {
        this.title = title;
        this.duedate = duedate;
        this.status = status;
        this.id = Math.random()*Date.now();
  }
}

let tasks = new Array();

//for testing
const defaultTasks = [
    new Task("Beispiel", "2022-11-3"),
    new Task("Beispiel2", "2022-11-3", "backlog"),
    new Task("Beispiel3", "", "inProgress"),
    new Task("Beispiel4", "2022-11-16", "finished")
];
//

document.onload = onload();
function onload() {
    renderLocalStorage();
    if(getProjectId() != "nonProjectRelated") {
        if(window.location.pathname == "/tasks.html") {
            window.location.search = "?projectid=nonProjectRelated";
        } else {
            setProjectTitleInManage();
        }
    }
}

async function setTasks(tasks) {
    let id = getProjectId();
    fetch(`http://localhost:5000/setTasks?projectid=${id}`, {
        method: 'POST',
        body: JSON.stringify(tasks),
    })
}

async function getTasks() {
    let id = getProjectId();
    return fetch(`http://localhost:5000/getTasks?projectid=${id}`, {
    	method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        return data;
    })
}

function getProjectId() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("projectid");
    return projectId;
}

function renderLocalStorage() {
    //Todo: Load Local Storage
    tasks = JSON.parse(localStorage.getItem("project"+getProjectId())) || defaultTasks;
    
    tasks.forEach((e) => {
        renderTask(e);
    })
}

function updateLocalStorage() {
    localStorage.setItem("project" + getProjectId(), JSON.stringify(tasks));
}

function setProjectTitleInManage() {
    const projects = JSON.parse(localStorage.getItem("projects"));
    const project = projects.find(x => x.id == getProjectId());
    
    document.getElementById("manage").textContent = ("Manage " + project.title + ":");
}

function createTask() {
    let task_title = document.getElementById("task-title").value;
    let task_duedate_check = document.getElementById("task-duedate-check").checked;
    let task_duedate;

    if(task_title == "") {
        alert("Title can't be empty!");
        return;
    }
    if(task_duedate_check) {
        task_duedate = document.getElementById("task-duedate").value;
    }

    let task = new Task(task_title, task_duedate);
    tasks.push(task);
    renderTask(task);
    updateLocalStorage();
}

function editTask() {
    let taskNodeId = document.querySelector("[edit]").closest("div.task-item").dataset.id;
    let task = tasks.find(x => x.id == taskNodeId);

    let task_title = document.getElementById("task-title").value;
    let task_duedate = document.getElementById("task-duedate").value;

    task.title = task_title;
    task.duedate = task_duedate;

    renderTask(task);
    updateLocalStorage();
}

function renderTask(task) {
    let backlog = document.getElementById("backlog").children[1];
    let inProgress = document.getElementById("inProgress").children[1];
    let finished = document.getElementById("finished").children[1];
    let edit = document.querySelector("[edit]");
    let taskNode;

    if (edit == null) {
        taskNode = document.getElementById("task-template").content.cloneNode(true).children[0];
        taskNode.getElementsByClassName("task-edit-div")[0].addEventListener("click", editTaskPopup);
    } else {
        taskNode = edit.closest("div.task-item");
    }

    taskNode.children[0].children[0].textContent = task.title;
    taskNode.children[0].children[1].textContent = task.duedate;
    taskNode.dataset.id = task.id;

    taskNode.addEventListener("dragstart", dragStart);
    taskNode.addEventListener("dragend", dragEnd);

    let date = taskNode.children[0].children[1]
    if(task.duedate == "" || task.duedate == null) {
        date.setAttribute("hidden","");
    } else {
        date.removeAttribute("hidden");
    }

    if (edit == null) {
        backlog.appendChild(taskNode);
    }

    let position_index = tasks.indexOf(task);
    let status = task.status;

    if (status == "backlog") {
        backlog.insertBefore(taskNode, backlog.children[position_index]);
    }
    else if (status == "inProgress") {
        inProgress.insertBefore(taskNode, inProgress.children[position_index]);
    }
    else if (status == "finished") {
        finished.insertBefore(taskNode, finished.children[position_index]);
    }

    let popup_create = document.getElementById("popup-create");
    let popup_edit = document.getElementById("popup-edit");
    if (popup_create) {
        document.getElementById("popup-create").remove();
    } 
    if (popup_edit) {
        document.getElementById("popup-edit").remove();
        taskNode.children[1].removeAttribute("edit");
    }
}

let create = document.getElementById("create-new");
create.addEventListener("click", createTaskPopup)
function createTaskPopup() {
    if (document.getElementById("popup-create") != null) {
        return;
    }
    let popup_create = document.getElementById("popup-create-template").content.cloneNode(true).children[0];
    document.getElementById("main").appendChild(popup_create);

    document.getElementById("task-title").focus();

    document.getElementById("task-save").addEventListener("click", createTask);
    enableSubmitWithEnter();
}

function editTaskPopup(event) {
    if (document.getElementById("popup-edit") != null) {
        return;
    }
    let popup_edit = document.getElementById("popup-edit-template").content.cloneNode(true).children[0];
    document.getElementById("main").appendChild(popup_edit);
    
    event.currentTarget.setAttribute("edit","");

    let task_title = event.currentTarget.parentNode.children[0].children[0].textContent;
    let task_duedate = event.currentTarget.parentNode.children[0].children[1].textContent;
    document.getElementById("task-title").value = task_title;
    document.getElementById("task-duedate").value = task_duedate;
    document.getElementById("task-title").focus();

    document.getElementById("task-save").addEventListener("click", editTask);
    document.getElementById("task-delete").addEventListener("click", deleteTask);
    enableSubmitWithEnter();
}

function deleteTask() {
    let taskNode = document.querySelector("[edit]").closest("div.task-item");
    let taskNodeId = taskNode.dataset.id;
    let task = tasks.find(x => x.id == taskNodeId);
    let popup_edit = document.getElementById("popup-edit");

    tasks.splice(tasks.indexOf(task), 1);
    
    taskNode.remove();
    popup_edit.remove();

    updateLocalStorage();
}

function enableSubmitWithEnter() {
    let inputs = document.getElementsByClassName("form-item");
    for (i of inputs) {
        i.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                if(document.querySelector("[edit]") == null) {
                    createTask();
                } else {
                    editTask();
                } 
                blur();
            }
          });
    }
}

//Drag and Drop Tasks
let draggedTask = null;

const tasksAll = document.querySelectorAll(".task-item");
tasksAll.forEach((task) => {
    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);
});
function dragStart() {
    draggedTask = this;
    //console.log("dragStart");
}
function dragEnd() {
    draggedTask = null;
    //console.log("dragEnd");
}

const status_stages = document.querySelectorAll(".div-tasklist");
status_stages.forEach((status) => {
    status.addEventListener("dragover", function(e) {
        e.preventDefault();
        let task_index = Array.from(this.children).indexOf(event.target.closest("div.task-item"));
        this.insertBefore(draggedTask, this.children[task_index]);
        //console.log("dragOver");
    });
    status.addEventListener("dragenter", function() {
        //console.log("dragEnter");
    });
    status.addEventListener("dragleave", function() {
        //console.log("dragLeave");
    });
    status.addEventListener("drop", function(event) {
        let task_index = Array.from(this.children).indexOf(event.target.closest("div.task-item"));
        this.insertBefore(draggedTask, this.children[task_index]);

        let nodes = Array.prototype.slice.call(this.children);
        let insertedAboveIndex = nodes.indexOf(draggedTask)+1;
        let insertedAbove = this.children[insertedAboveIndex];
        let task = tasks.find(x => x.id == draggedTask.dataset.id);
        if (insertedAbove) {
            let insertedAboveInTasks = tasks.find(x => x.id == insertedAbove.dataset.id);
            let insertedAboveInTasksIndex = tasks.indexOf(insertedAboveInTasks);
            tasks.splice(tasks.indexOf(task), 1);
            tasks.splice(insertedAboveInTasksIndex, 0, task);
        } else {
            tasks.splice(tasks.indexOf(task), 1);
            tasks.push(task);
        }
        
        let position = this.parentNode.id;
        task.status = position;

        updateLocalStorage();
        //console.log("dragDrop");
    });
});

