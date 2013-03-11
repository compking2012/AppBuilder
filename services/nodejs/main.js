var restify = require("restify");
//var db = require("db");

var restServer = restify.createServer();

//Get user
restServer.get("/user", function(request, response, next) {

});

//Create a new project
restServer.post("/projects", function(request, response, next) {

});

//Retrieve all projects
restServer.get("/projects", function(request, response, next) {

});

//Retrieve a project
restServer.get("/projects/:id", function(request, response, next) {

});

//Update a project
restServer.put("/projects/:id", function(request, response, next) {

});

//Delete a project
restServer.delete("/projects/:id", function(request, response, next) {

});

//Create a new page of a project
restServer.post("/projects/:id/pages", function(request, response, next) {

});

//Retrieve all pages of a project
restServer.post("/projects/:id/pages", function(request, response, next) {

});

//Retrieve a page of a project
restServer.post("/projects/:id/pages/:pid", function(request, response, next) {

});

//Update a page of a project
restServer.put("/projects/:id/pages/:pid", function(request, response, next) {

});

//Delete a page of a project
restServer.delete("/projects/:id/pages/:pid", function(request, response, next) {

});