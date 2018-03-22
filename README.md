# Ridertrack

An accessible tracking platform for outdoor sports events.

Project based on this [SCORE project proposal](http://score-contest.org/2018/projects/ridertrack.php).

Live version accessible here: [https://rider-track-dev.herokuapp.com](https://rider-track-dev.herokuapp.com)
## Build status
Stable version: [![Build Status](https://travis-ci.org/alessandrocaprarelli/ridertrack.svg?branch=master)](https://travis-ci.org/alessandrocaprarelli/ridertrack) Development version: [![Build Status](https://travis-ci.org/alessandrocaprarelli/ridertrack.svg?branch=development)](https://travis-ci.org/alessandrocaprarelli/ridertrack)


## Getting started

### Clone the repo

Using ssh:
```
git git@github.com:alessandrocaprarelli/ridertrack.git
```

Using https
```
git https://github.com/alessandrocaprarelli/ridertrack.git
```

### Prerequisites
- Node.js v 8.9.0: https://nodejs.org/en/download/
- Npm 5.5.1 (should be already included in node)
- Mongodb v 3.4.2: https://docs.mongodb.com/v3.4/installation/
- Angular4: After having installe node and npm: `npm install -g @angular/cli`

### Installing
Make sure you have all the prerequisites installed.

Install all the dependencies running:
```
npm install
```

### Local development environment

Make sure mongodb is running on port 27017 and run:
```
npm run dev
```

In the console you should see the output of both node.js web server and angular webpack server.
The node.js web server is usually ready after few seconds and you can understand it after you see:
```
Server listening on port: 5000
[MDB] Successfully connected to MongoDB
```
The angular application takes a bit more to load and you understand that is ready when you see:
```
webpack: Compiled successfully.
```

Once both are running you can access the application on localhost:4200, the port of the webpack server.

Everytime you make a change to the angular app, the webpack server recompiles the code and serve a new version of the frontend.
Everytime you make a change to the node.js app, nodemon notices that and restart the web server.

Known issues:
- In linux the live reload may crash. You can fix it by typing in your terminal `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

### Production environment

The webpack server should not be used in a production environment.
For that reason the angular code is compiled and served through the node.js application.

Make sure mongodb is running and run:
```
npm run prod
```
The application is ready when you see:
```
Server listening on port: 5000
[MDB] Successfully connected to MongoDB
```

In this case you don't need to wait also for the webpack compilation, because has been done during `ng build`.

### Docker image
We maintain a docker image to run the project in a production environment. A Dockerfile first builds the angular app and then starts the Node web server.

Everything is executed by a docker-compose file that starts also a MongoDb instance and links it with the web server.

Be sure that Docker and Docker Compose are installed and the docker deamon is running.
```
# to check that docker is installed. it should ouput a version code
docker --version

# to check that docker-compose is installed. it should ouput a version code
docker-compose --version

# to start the docker deamon in linux
sudo service docker restart 
```

In order to start the complete environment you need to run from the root of the project.
```
# in linux
sudo docker-compose up

# windows
docker-compose up
```


### Virtualbox image
We have created a VirtualBox image that contains everything configured.
In order to use it, you should create a new virtual machine in Virtualbox and select our .vdi when the system asks you to create/select an hard drive.
Remember to use a bridged connection.

The main user password is the same as the username. The root user password is the same as well.

### Mongodb
By default the node.js app tries to connect to a local installation of mongodb.
If you want to connect to a different mongodb, you can pass either the complete uri setting `MONGODB_URI` environment variable or each single part of the uri:
```
MONGODB_URI

or
MONGODB_HOST
MONGODB_PORT
DATABASE_NAME
```

### Running the tests

You can run test on the node.js application running:
```
npm run test-backend
```

## Documentation

During the development of the project, the team met some milestones and deadlines.
Some documents (requirements, project plan, tests, design..) were produced and are accessible in the public page of the project [DSD Ridertrack](https://www.fer.unizg.hr/rasip/dsd/projects/ridertrack_score/documents)

In addition, the REST API offered by the backend was documented using swagger. It is accessible [here](https://rider-track-dev.herokuapp.com/swagger)
## Authors

- Alessandro Caprarelli [![Alessandro Caprarelli - Linkedin](https://www.northerntrust.com/images/LinkedIn_Logo16px.png)](https://www.linkedin.com/in/alessandrocaprarelli/)
- Giulia Leonardi
- Marzia Degiorgi
- Mariano Etchart
- Ante Breščić
- Ivan Kvesić 
- Josip Mališa
