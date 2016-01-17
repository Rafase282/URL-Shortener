'use strict';
var validUrl = require('valid-url');
module.exports = function(app) {

  app.get('/new/:url*', function(req, res) {
    
    var url = req.url.slice(5);
    var urlObj = validUrl.isUri(url) ? {
      "original_url": url,
      "short_url": process.env.APP_URL + "4"
    } : {
      "error": "No short url found for given input"
    };
    res.send(urlObj);

  });

};