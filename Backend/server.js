const http = require('http');
const {projectList, defaultProjects} = require('./db.js');
const mongodb = require('mongodb');

const url = 'mongodb://localhost:27017';
const mongoClient = new mongodb.MongoClient(url);

const hostname = '127.0.0.1';
const port = 5000;

async function startServer() {
    await mongoClient.connect();

    //mongoClient.db('projectmanager').collection('projects').deleteMany({});

    let defaultCollection = await mongoClient.db('projectmanager').collection('projects').find({
        _id: 1,
    }).toArray();
    if(defaultCollection.length == 0) {
        mongoClient.db('projectmanager').collection('projects').insertMany(defaultProjects);
    }

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

const server = http.createServer(async (request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');

    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const id = url.searchParams.get('projectid');
    const projectsCollection = mongoClient.db('projectmanager').collection('projects');
    switch (url.pathname) {
        case '/getProjects':
            response.write(JSON.stringify(await projectList.getProjects(projectsCollection)));
            break;
        case '/getProject':
            if(id){
                try {
                    response.write(JSON.stringify(await projectList.getProject(projectsCollection,id)));
                } catch {
                    break;
                }
            }
            break;
        case '/addProject':
            if(request.method === 'POST') {
                let jsonString = '';
                request.on('data', (data) => {
                    jsonString += data;
                });
                request.on('end', () => {
                    projectList.addProject(projectsCollection,JSON.parse(jsonString));
                });
            }
            break;
        case '/updateProject':
            if(request.method === 'PUT') {
                let jsonString = '';
                request.on('data', (data) => {
                    jsonString += data;
                });
                request.on('end', () => {
                    projectList.updateProject(projectsCollection,JSON.parse(jsonString));
                });
            }
            break;
        case '/removeProject':
            if(id){
                try {
                    projectList.deleteProject(projectsCollection,id);
                } catch {
                    break;
                }
            }
            break;
        case '/setTasks':
            if(id) {
                try {
                    if(request.method === 'POST') {
                        let jsonString = '';
                        request.on('data', (data) => {
                            jsonString += data;
                        });
                        request.on('end', async () => {
                            let project = await projectList.getProject(projectsCollection,id);
                            project.tasks = JSON.parse(jsonString);
                            projectList.updateProject(projectsCollection,project);
                        });
                    }
                } catch {
                    break;
                }
            }
            break;
        case '/getTasks':
            if(id) {
                try {
                    let project = await projectList.getProject(projectsCollection,id);
                    console.log(project);
                    response.write(JSON.stringify(project.tasks));
                } catch {
                    break;
                }
            }
            break;
        default:
            response.statusCode = 404;
    }
    response.end();
    });
  
startServer();