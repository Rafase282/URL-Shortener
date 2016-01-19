'use strict';
var validUrl = require('valid-url');
module.exports = function(app, db) {

  app.route('/:url')
    .get(function(req, res) {
      var sites = db.collection('sites');
      var url = req.params.url;
      //sites.find({original_url: url.original_url});
      res.send("redirect");
      //res.redirect(sites.url.original_url);
    });

  app.get('/new/:url*', function(req, res) {
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
    res.send(urlObj || {
      original_url: urlObj.original_url,
      short_url: urlObj.short_url
    });
  });

  function linkGen() {
    // Generates random number for link
    var num = Math.floor(100000 + Math.random() * 900000);
    return num.toString().substring(0, 4);
  }

  function save(obj, db) {
    // Save object into db.
    var sites = db.collection('sites');
    sites.insert(obj, function(err, result) {
      if (err) throw err;
    });
  }

  function checkDB(obj, db) {
    // Check to see if the site is already there
    var sites = db.collection('sites');
    return sites.find({
      original_url: obj.original_url
    });
  }

};