function createPopup() {
    if (document.getElementById("popup-create") != null) {
        return;
    }
    let popup_create = document.getElementById("popup-create-template").content.cloneNode(true).children[0];
    document.getElementById("main").appendChild(popup_create);
}

function createOrEditProject() {
    let projectlist = document.getElementById("projectlist");
    if (document.querySelector("[edit]") == null) {
        var project = document.getElementById("project-template").content.cloneNode(true).children[0];
    } else {
        var project = document.querySelector("[edit]").closest("div.div-project");
    }
    let project_title = document.getElementById("project-title").value;
    let project_description = document.getElementById("project-description").value;

    if(project_title == "") {
        return;
    }

    project.children[0].children[1].textContent = project_title;
    project.children[1].textContent = project_description;

    projectlist.appendChild(project);

    if (document.querySelector("[edit]") == null) {
        document.getElementById("popup-create").remove();
    } else {
        document.getElementById("popup-edit").remove();
        project.children[0].children[0].removeAttribute("edit");
    }
}

function editProjectPopup(editproject) {
    if (document.getElementById("popup-edit") != null) {
        return;
    }
    let popup_edit = document.getElementById("popup-edit-template").content.cloneNode(true).children[0];
    document.getElementById("main").appendChild(popup_edit);
    
    editproject.setAttribute("edit","");

    let project_title = editproject.parentNode.children[1].textContent;
    let project_description = editproject.parentNode.parentNode.children[1].textContent;
    document.getElementById("project-title").value = project_title;
    document.getElementById("project-description").value = project_description;
}

//Close popup when clicked elsewhere
document.addEventListener("click", function(event){
    let popup_create = document.getElementById("popup-create");
    let button_create = document.getElementById("create-new");
    if (popup_create != null && button_create != null) {
        if (!popup_create.contains(event.target) && !button_create.contains(event.target)) {
            popup_create.remove();    
        }    
    }
    let popup_edit = document.getElementById("popup-edit");
    let button_edit = document.querySelector("[edit]");
    if (popup_edit != null && button_edit != null) {
        if (!popup_edit.contains(event.target) && !button_edit.contains(event.target)) {
            popup_edit.remove();
            button_edit.removeAttribute("edit");
        }
    }
});

function deleteProject() {
    let popup_edit = document.getElementById("popup-edit");
    let project = document.querySelector("[edit]").closest("div.div-project");
    project.remove();
    popup_edit.remove();
}

function editTaskPopup(edittask) {
    if (document.getElementById("popup-edit") != null) {
        return;
    }
    let popup_edit = document.getElementById("popup-edit-template").content.cloneNode(true).children[0];
    document.getElementById("main").appendChild(popup_edit);
    
    edittask.setAttribute("edit","");

    let task_title = edittask.parentNode.children[0].children[0].textContent;
    let task_duedate = edittask.parentNode.children[0].children[1].textContent;
    document.getElementById("task-title").value = task_title;
    document.getElementById("task-duedate").value = task_duedate;
}

function createOrEditTask() {
    let backlog = document.getElementById("backlog").children[1];
    let inProgress = document.getElementById("inProgress").children[1];
    let finished = document.getElementById("finished").children[1];

    if (document.querySelector("[edit]") == null) {
        var task = document.getElementById("task-template").content.cloneNode(true).children[0];
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

    if (document.querySelector("[edit]") == null || document.querySelector("[edit]").closest("div.div-task-wrap").id == "backlog") {
        backlog.appendChild(task);
    }
    else if (document.querySelector("[edit]").closest("div.div-task-wrap").id == "inProgress") {
        inProgress.appendChild(task);
    }
    else if (document.querySelector("[edit]").closest("div.div-task-wrap").id == "finished") {
        finished.appendChild(task);
    }

    if (document.querySelector("[edit]") == null) {
        document.getElementById("popup-create").remove();
    } else {
        document.getElementById("popup-edit").remove();
        task.children[1].removeAttribute("edit");
    }
}

function deleteTask() {
    let popup_edit = document.getElementById("popup-edit");
    let task = document.querySelector("[edit]").closest("div.task-item");
    task.remove();
    popup_edit.remove();
}