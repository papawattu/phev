"use strict";

const PORT  =   8080;

var express = require('express');
var status = require('http-status');
var app = express();

app.post('/', function (req, res) {
  res.json({'version' : "0.1","operations" : [{"op" : "mainLights"}]});
  res.status(200);
});

app.all('/',function (req,res) {
    res.status(status.NOT_IMPLEMENTED);
});

app.listen(PORT, function () {
  console.log('PHEV server app listening on port ' + PORT);
});