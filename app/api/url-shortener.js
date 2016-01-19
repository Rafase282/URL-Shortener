'use strict';
var validUrl = require('valid-url');
module.exports = function(app, db) {

  app.route('/:url')
    // Check and retrieve url to redirect if it exist.
    .get(function(req, res) {
      var url = process.env.APP_URL + req.params.url;
      if (url != process.env.APP_URL + 'favicon.ico') {
        checkDB(url, db);
        res.send("redirect");
        //res.redirect(sites.url.original_url);
      }
    });

  app.get('/new/:url*', function(req, res) {
    // Create short url, store and display the info.
    var url = req.url.slice(5);
    var urlObj = {};
    if (validUrl.isUri(url)) {
      urlObj = {
        "original_url": url,
        "short_url": process.env.APP_URL + linkGen()
      };
      //console.log(checkDB(urlObj, db));
      save(urlObj, db);
    } else {
      urlObj = {
        "error": "No short url found for given input"
      };
    }
    res.send({
      original_url: urlObj.original_url,
      short_url: urlObj.short_url
    } || urlObj);
  });

  function linkGen() {
    // Generates random number for link
    var num = Math.floor(100000 + Math.random() * 900000);
    return num.toString().substring(0, 4);
  }

  function save(obj, db) {
    // Save object into db.
    var sites = db.collection('sites');
    sites.save(obj, function(err, result) {
      if (err) throw err;
      console.log('Saved ' + result);
    });
  }

  function checkDB(obj, db) {
    // Check to see if the site is already there
    var sites = db.collection('sites');
    // get the url
    sites.find({
      "short_url": obj
    }, function(err, url) {
      if (err) throw err;
      // object of the url
      console.log('Found ' + url);
    });
  }

};