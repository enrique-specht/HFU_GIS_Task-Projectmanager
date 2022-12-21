const mongodb = require('mongodb');

class Project {

    constructor(title, description="") {
        this.title = title;
        this.description = description;
        this._id = Math.random()*Date.now();
        this.tasks = new Array();
  }
}

const defaultProjects = [
    //Project for Tasks Tab
    {
        title: "Tasks Tab",
        description: null,
        _id: 1,
        tasks: new Array()
    },
    new Project("Database Project Template","Description"),
];

class Projects {
    constructor(){
        this.projects = defaultProjects;
    }

    async addProject(projectsCollection,project){
        if(!project || !project._id || !project.title){
            console.warn("No valid project given!");
            return;
        }
        //this.projects[this.projects.length] = project;
        projectsCollection.insertOne(project);
    }

    async getProjects(projectsCollection){
        //return this.projects;
        return await projectsCollection.find({}).toArray();
    }

    async getProject(projectsCollection,id){
        //return this.projects.filter(storedProject => storedProject.id == id)[0];
        let project = await projectsCollection.find({
            _id: Number(id),
        }).toArray();
        return project[0];
    }

    async updateProject(projectsCollection,project){
        if(!project || !project._id || !project.title){
            console.warn("No valid project given!");
            return;
        }
        //const index = this.projects.findIndex(storedProject => storedProject.id == project.id);
        //this.projects[index] = project;
        projectsCollection.replaceOne({
            _id: project._id,
        },
        project);
    }

    async deleteProject(projectsCollection,id){
        //this.projects = this.projects.filter(project => project.id != id);
        projectsCollection.deleteOne({
            _id: Number(id),
        });
    }
}

const projectList = new Projects();

module.exports = {projectList, defaultProjects};