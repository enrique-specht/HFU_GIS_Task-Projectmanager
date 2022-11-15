let create = document.getElementById("create-new");
create.addEventListener("click", createTaskPopup)
function createTaskPopup() {
    if (document.getElementById("popup-create") != null) {
        return;
    }
    let popup_create = document.getElementById("popup-create-template").content.cloneNode(true).children[0];
    document.getElementById("main").appendChild(popup_create);

    document.getElementById("task-save").addEventListener("click", createOrEditTask);
    enableSubmitWithEnter();
}

let edit = document.getElementsByClassName("task-edit-div");
for (i of edit) {
    i.addEventListener("click", editTaskPopup);
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

    document.getElementById("task-save").addEventListener("click", createOrEditTask);
    document.getElementById("task-delete").addEventListener("click", deleteTask);
    enableSubmitWithEnter();
}

function createOrEditTask() {
    let backlog = document.getElementById("backlog").children[1];
    let inProgress = document.getElementById("inProgress").children[1];
    let finished = document.getElementById("finished").children[1];

    if (document.querySelector("[edit]") == null) {
        var task = document.getElementById("task-template").content.cloneNode(true).children[0];
        task.getElementsByClassName("task-edit-div")[0].addEventListener("click", editTaskPopup);
    } else {
        var task = document.querySelector("[edit]").closest("div.task-item");
    }
    let task_title = document.getElementById("task-title").value;
    let task_duedate = document.getElementById("task-duedate").value;
    let task_duedate_check = "true";
    if (document.querySelector("[edit]") == null) {
        task_duedate_check = document.getElementById("task-duedate-check").checked;
    }

    if(task_title == "") {
        return;
    }
    if(task_duedate == "" || !task_duedate_check) {
        task.children[0].children[1].setAttribute("hidden","");
        task_duedate = "";
    } else {
        task.children[0].children[1].removeAttribute("hidden");
    }

    task.children[0].children[0].textContent = task_title;
    task.children[0].children[1].textContent = task_duedate;

    if (document.querySelector("[edit]") == null) {
        backlog.appendChild(task);
    } else {
        let position_child = document.querySelector("[edit]").closest("div.task-item");
        let position_parent = position_child.parentNode;
        let position_index = Array.prototype.indexOf.call(position_parent.children, position_child);
        let status_id = document.querySelector("[edit]").closest("div.div-task-wrap").id;

        if (status_id == "backlog") {
            backlog.insertBefore(task, position_parent.children[position_index]);
        }
        else if (status_id == "inProgress") {
            inProgress.insertBefore(task, position_parent.children[position_index]);
        }
        else if (status_id == "finished") {
            finished.insertBefore(task, position_parent.children[position_index]);
        }
    }

    if (document.querySelector("[edit]") == null) {
        document.getElementById("popup-create").remove();
    } else {
        document.getElementById("popup-edit").remove();
        task.children[1].removeAttribute("edit");
    }

    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);
}

function deleteTask() {
    let popup_edit = document.getElementById("popup-edit");
    let task = document.querySelector("[edit]").closest("div.task-item");
    task.remove();
    popup_edit.remove();
}

function enableSubmitWithEnter() {
    let inputs = document.getElementsByClassName("form-item");
    for (i of inputs) {
        i.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault();
              createOrEditTask();
            }
          });
    }
}

//Drag and Drop Tasks
let draggedTask = null;

const tasks = document.querySelectorAll(".task-item");
tasks.forEach((task) => {
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
        //this.appendChild(draggedTask);
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
        //this.appendChild(draggedTask);
        //console.log("dragDrop");
    });
});

