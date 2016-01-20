'use strict';
var validUrl = require('valid-url');
module.exports = function(app, db) {

  app.route('/:url')
    // Check and retrieve url to redirect if it exist.
    .get(function(req, res) {
      var url = process.env.APP_URL + req.params.url;
      if (url != process.env.APP_URL + 'favicon.ico') {
        checkDB(url, db, res);
      }
    });

  app.get('/new/:url*', function(req, res) {
    // Create short url, store and display the info.
    var url = req.url.slice(5);
    var urlObj = {};
    if (validateURL(url)) {
      urlObj = {
        "original_url": url,
        "short_url": process.env.APP_URL + linkGen()
      };
      res.send(urlObj);
      save(urlObj, db);
    } else {
      urlObj = {
        "error": "No short url found for given input"
      };
      res.send(urlObj);
    }
  });

  function linkGen() {
    // Generates random four digit number for link
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

  function checkDB(link, db, res) {
    // Check to see if the site is already there
    var sites = db.collection('sites');
    // get the url
    sites.findOne({
      "short_url": link
    }, function(err, result) {
      if (err) throw err;
      // object of the url
      if (result) {
        // we have a result
        console.log('Found ' + result);
        console.log('Redirecting to: ' + result.original_url);
        res.redirect(result.original_url);
    } else {
        // we don't
        res.send('Site not found');
    }
    });
  }
  
  function validateURL(url) {
    // Checks to see if it is an actual url
    
    // /^http(s)?\:\/\/.+\.\w+$/gi
    
    return validUrl.isUri(url);
  }

};