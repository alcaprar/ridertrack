# Web server instruction

## Dependencies
You have to install:
- Node.js version 8.9
- MongoDB version ??
- Gulp: "npm install -g gulp"

## How to run the web server
- Move into the "web server".
- Run "npm install" to install missing packages.
- Run "gulp". It should write into the terminal: "Server listening on port...". You should also see that it successfully connects to MongoDB.
- After that you have the web server running on the specified port.

## How to develop
When you run the web server with gulp, it runs the web server using nodemon a library that checks for changes in the code and re run the web server.
In this way you do not need to kill the process and re run it but you have always the web server running with the latest changes.

## How to test
To run tests you just need to run "npm test".
After that you see a list of outcomes. All the tests MUST pass.
