# Ridertrack

An accessible tracking platform for outdoor sports events.

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
cd ridertrack-web
npm install
```

### Local development environment

Make sure mongodb is running on port 27017 and run:
```
cd ridertrack-web
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

### Production environment

The webpack server should not be used in a production environment.
For that reason the angular code is compiled and served through the node.js application.

In order to run a production version of the app:
```
cd ridertrack-web
ng build
npm start
```
The application is ready when you see:
```
Server listening on port: 5000
[MDB] Successfully connected to MongoDB
```

In this case you don't need to wait also for the webpack compilation, because has been done during `ng build`.

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
cd ridertrack-web
npm run webserver-test
```

### Deploy to heroku

## Documentation
[links to docs]
## Authors

- Alessandro Caprarelli
- Giulia Leonardi
- Marzia Degiorgi
- Mariano Etchart
- Ante Breščić
- Ivan Kvesić 
- Josip Mališa