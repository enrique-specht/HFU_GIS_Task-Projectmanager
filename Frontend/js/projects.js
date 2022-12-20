class Project {

    constructor(title, description="") {
        this.title = title;
        this.description = description;
        this.id = Math.random()*Date.now();
        this.tasks = null;
  }
}

let projects = new Array();

//for testing
const defaultProjects = [
    {
        title: "Beispiel",
        description: "Test",
        id: Math.random()*Date.now(),
        tasks: null
    },
    {
        title: "Beispiel2",
        description: "",
        id: Math.random()*Date.now(),
        tasks: null
    },
];
//

document.onload = onload();
function onload() {
    render();
    if(localStorage.getItem("nonProjectRelated") == null) {
        localStorage.setItem("nonProjectRelated", JSON.stringify(new Project()));
    }
}

function render() {
    let p = new Array();
    for(i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if(key != "nonProjectRelated") {
            let project = JSON.parse(localStorage.getItem(key));
            p.push(project);
        }
    }
    if (p.length <= 0) {
        projects = defaultProjects;
        save();
    } else {
        projects = p
    }
    
    projects.forEach((e) => {
        renderProject(e);
    })
}

function save(id) {
    for(i = 0; i<projects.length; i++) {
        localStorage.setItem(projects[i].id, JSON.stringify(projects[i]));
    }
    if(id) {
        localStorage.removeItem(id);
    }
}

async function getProject(id) {
    return fetch(`http://localhost:5000/getProject?projectid=${id}`, {
    	method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        return data;
    })
}

async function getProjects() {
    return fetch('http://localhost:5000/getProjects', {
    	method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        return data;
    })
}

async function addProject(project) {
    fetch('http://localhost:5000/addProject', {
        method: 'POST',
        body: JSON.stringify(project),
    })
}

async function updateProject(project) {
    fetch('http://localhost:5000/updateProject', {
        method: 'PUT',
        body: JSON.stringify(project),
    })
}

async function removeProject(id) {
    fetch(`http://localhost:5000/removeProject?projectid=${id}`);
}

function createProject() {
    let project_title = document.getElementById("project-title").value;
    let project_description = document.getElementById("project-description").value;
    
    if (project_title == "") {
        alert("Title can't be empty!");
        return;
    }
    let project;
    if (project_description == "") {
        project = new Project(project_title);
    } else {
        project = new Project(project_title, project_description);
    }

    projects.push(project);
    renderProject(project);
    save();
}

function editProject() {
    let projectNodeId = document.querySelector("[edit]").closest("div.div-project").dataset.id;
    let project = projects.find(x => x.id == projectNodeId);

    let project_title = document.getElementById("project-title").value;
    let project_description = document.getElementById("project-description").value;

    project.title = project_title;
    project.description = project_description;

    renderProject(project);
    save();
}

function renderProject(project) {
    let projectlist = document.getElementById("projectlist");
    let edit = document.querySelector("[edit]");
    let projectNode;
    if (edit == null) {
        projectNode = document.getElementById("project-template").content.cloneNode(true).children[0];
        projectNode.getElementsByClassName("project-edit-button")[0].addEventListener("click", editProjectPopup);
    } else {
        projectNode = edit.closest("div.div-project");
    }

    projectNode.children[0].children[1].textContent = project.title;
    projectNode.children[1].textContent = project.description;
    projectNode.dataset.id = project.id;

    projectNode.addEventListener("click", forwarding);

    let position_index = projects.indexOf(project);
    projectlist.insertBefore(projectNode, projectlist.children[position_index]);

    let popup_create = document.getElementById("popup-create");
    let popup_edit = document.getElementById("popup-edit");
    if (popup_create) {
        document.getElementById("popup-create").remove();
    }
    if (popup_edit){
        document.getElementById("popup-edit").remove();
        projectNode.children[0].children[0].removeAttribute("edit");
    }
}

let create = document.getElementById("create-new");
create.addEventListener("click", createProjectPopup)
function createProjectPopup() {
    if (document.getElementById("popup-create") != null) {
        return;
    }
    let popup_create = document.getElementById("popup-create-template").content.cloneNode(true).children[0];
    document.getElementById("main").appendChild(popup_create);

    document.getElementById("project-save").addEventListener("click", createProject);
    enableSubmitWithEnter();
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

    document.getElementById("project-save").addEventListener("click", editProject);
    document.getElementById("project-delete").addEventListener("click", deleteProject);
    enableSubmitWithEnter();
}

function deleteProject() {
    let projectNode = document.querySelector("[edit]").closest("div.div-project");
    let projectNodeId = projectNode.dataset.id;
    let project = projects.find(x => x.id == projectNodeId);
    let popup_edit = document.getElementById("popup-edit");

    projects.splice(projects.indexOf(project), 1);

    projectNode.remove();
    popup_edit.remove();

    save(projectNodeId);
}

function enableSubmitWithEnter() {
    let inputs = document.getElementsByClassName("form-item");
    for (i of inputs) {
        i.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              event.preventDefault();
              if(document.querySelector("[edit]") == null) {
                createProject();
            } else {
                editProject();
            } 
              blur();
            }
          });
    }
}

let projectsNodes = document.getElementsByClassName("div-project");
for (i of projectsNodes) {
    i.addEventListener("click", forwarding);
}

function forwarding(e) {
    e.stopPropagation();
    let project = projects.find(x => x.id == this.dataset.id);
    window.location.href = ('./project.html?projectid='  + project.id);
}