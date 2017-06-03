'use strict';
module.exports = function(app, db) {

  app.route('/:url')
    // Check and retrieve url to redirect if it exist.
    .get(handleGet);

  app.get('/new/:url*', handlePost);

  function handleGet(req, res) {
    var url = process.env.APP_URL + req.params.url;
    if (url != process.env.APP_URL + 'favicon.ico') {
      findURL(url, db, res);
    }
  }

  function handlePost(req, res) {
    // Create short url, store and display the info.
    var url = req.url.slice(5);
    var urlObj = {};
    if (validateURL(url)) {

      // Generate link, save in db and send response
      linkGen(url, res, db, save);
    } else {
      urlObj = {
        "error": "Wrong url format, make sure you have a valid protocol and real site."
      };
      res.send(urlObj);
    }
  }

  function linkGen(url, res, db, callback) {
    // Gather all existing short links
    db.collection('sites').find().toArray((err, data) => {
      if (err) return callback(err);

      // Put all short links in an array
      var urlList = data.map((obj) => {
        return obj.short_url;
      });

      var newLink;
      // Generate link and check for uniqueness
      do {
        // Generates random four digit number for link
        var num = Math.floor(100000 + Math.random() * 900000);
        newLink = process.env.APP_URL + num.toString().substring(0, 4);
      } while (urlList.indexOf(newLink) != -1);

      return callback(null, url, newLink, res, db);
    });
  }

  function save(err, url, newLink, res, db) {
    if (err) throw err;

    // Create new object
    var urlObj = {
      "original_url": url,
      "short_url": newLink
    };

    // Save object into db.
    var sites = db.collection('sites');
    sites.save(urlObj, function(err, result) {
      if (err) throw err;

      // Send response object
      // We need to create the object again because
      // urlObj now contains database id
      res.send({
        "original_url": url,
        "short_url": newLink
      });
      console.log('Saved ' + result);
    });
  }

  function findURL(link, db, res) {
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
        res.send({
        "error": "This url is not on the database."
      });
      }
    });
  }

  function validateURL(url) {
    // Checks to see if it is an actual url
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
  }

};
