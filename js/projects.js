let create = document.getElementById("create-new");
create.addEventListener("click", createProjectPopup)
function createProjectPopup() {
    if (document.getElementById("popup-create") != null) {
        return;
    }
    let popup_create = document.getElementById("popup-create-template").content.cloneNode(true).children[0];
    document.getElementById("main").appendChild(popup_create);

    document.getElementById("project-save").addEventListener("click", createOrEditProject);
    enableSubmitWithEnter();
}

let edit = document.getElementsByClassName("project-edit-button");
for (i of edit) {
    i.addEventListener("click", editProjectPopup);
}
function editProjectPopup(event) {
    event.stopPropagation();
    if (document.getElementById("popup-edit") != null) {
        return;
    }
    let popup_edit = document.getElementById("popup-edit-template").content.cloneNode(true).children[0];
    document.getElementById("main").appendChild(popup_edit);
    
    event.currentTarget.setAttribute("edit","");

    let project_title = event.currentTarget.parentNode.children[1].textContent;
    let project_description = event.currentTarget.parentNode.parentNode.children[1].textContent;
    document.getElementById("project-title").value = project_title;
    document.getElementById("project-description").value = project_description;

    document.getElementById("project-save").addEventListener("click", createOrEditProject);
    document.getElementById("project-delete").addEventListener("click", deleteProject);
    enableSubmitWithEnter();
}

function createOrEditProject() {
    let projectlist = document.getElementById("projectlist");
    if (document.querySelector("[edit]") == null) {
        var project = document.getElementById("project-template").content.cloneNode(true).children[0];
        project.getElementsByClassName("project-edit-button")[0].addEventListener("click", editProjectPopup);
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

function deleteProject() {
    let popup_edit = document.getElementById("popup-edit");
    let project = document.querySelector("[edit]").closest("div.div-project");
    project.remove();
    popup_edit.remove();
}

function enableSubmitWithEnter() {
    let inputs = document.getElementsByClassName("form-item");
    for (i of inputs) {
        i.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault();
              createOrEditProject();
              blur();
            }
          });
    }
}

let projects = document.getElementsByClassName("div-project");
for (i of projects) {
    i.addEventListener("click", function(e) {
        e.stopPropagation();
        let project_name = this.children[0].children[1].textContent;
        window.location.href = ("/project.html?" + project_name);
    });
}