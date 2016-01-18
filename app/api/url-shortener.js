'use strict';
var validUrl = require('valid-url');
module.exports = function(app, db) {

  app.get('/new/:url*', function(req, res) {
    var url = req.url.slice(5);
    var urlObj = {};

    if (validUrl.isUri(url)) {
      urlObj = {
        "original_url": url,
        "short_url": process.env.APP_URL + linkGen()
      };
      save(urlObj);
    } else {
      urlObj = {
        "error": "No short url found for given input"
      };
    }
    res.send(urlObj);
  });

  function linkGen() {
    // Generates random number for link
    var num = Math.floor(100000 + Math.random() * 900000);
    return num.toString().substring(0, 4);
  }

  function save(obj, db) {
    // Save object into db.
    db.sites.insert(obj, function(err, result) {
    
    if(err) throw err;
    });
  }

};