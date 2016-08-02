var express = require('express')
    , router = express.Router();
var registrationService = require('./registrationService');

router.post('/', function(req, res) {
  if(registrationService.createUser(req.body.username, req.body.firstname, req.body.lastname,
      req.body.email, req.body.password)) {
      res.status(200);
      res.end();
  } else {
      res.status(500);
      res.end();
  }
});

module.exports = router;