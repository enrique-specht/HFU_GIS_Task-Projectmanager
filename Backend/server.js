const http = require('http');
const projectList = require('./db.js');

const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');

    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const id = url.searchParams.get('projectid');
    switch (url.pathname) {
        case '/getProjects':
            response.write(JSON.stringify(projectList.projects));
            break;
        case '/getProject':
            if(id){
                try {
                    response.write(JSON.stringify(projectList.getProject(id)));
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
                    projectList.addProject(JSON.parse(jsonString));
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
                    projectList.updateProject(JSON.parse(jsonString));
                });
            }
            break;
        case '/removeProject':
            if(id){
                try {
                    projectList.deleteProject(id);
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
                        request.on('end', () => {
                            let project = projectList.getProject(id);
                            project.tasks = JSON.parse(jsonString);
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
                        let project = projectList.getProject(id);
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
  
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});