'use strict';

var express = require('express');
var mongo = require('mongodb');
var routes = require('./app/routes/index.js');
var api = require('./app/api/url-shortener.js');

var app = express();

mongo.MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {

  if (err) {
    throw new Error('Database failed to connect!');
  } else {
    console.log('Successfully connected to MongoDB on port 27017.');
  }

  // The format follows as, alias to use for real path, also allows permission to such path.
  app.use('/public', express.static(process.cwd() + '/public'));

  routes(app, db);
  api(app, db);

  var port = process.env.PORT || 8080;
  app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
  });

});