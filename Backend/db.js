class Project {

    constructor(title, description="") {
        this.title = title;
        this.description = description;
        this.id = Math.random()*Date.now();
        this.tasks = null;
  }
}

//for testing
const defaultProjects = [
    new Project("Project1","Test"),
    new Project("Project2"),
];
//

class Projects {
    constructor(){
        this.projects = defaultProjects;
    }

    addProject(project){
        if(!project || !project.id || !project.title){
            console.warn("No valid project given!");
            return;
        }
        this.projects[this.projects.length] = project;
    }

    getProject(id){
        return this.projects.filter(storedProject => storedProject.id == id)[0];
    }

    updateProject(project){
        if(!project || !project.id || !project.title){
            console.warn("No valid project given!");
            return;
        }
        const index = this.projects.findIndex(storedProject => storedProject.id == project.id);
        this.projects[index] = project;
    }

    deleteProject(id){
        this.projects = this.projects.filter(project => project.id != id);
    }
}

const projectList = new Projects();

module.exports = projectList;