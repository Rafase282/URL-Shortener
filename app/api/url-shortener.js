'use strict';

module.exports = function(app) {

    app.get('/new/:query', function(req, res) {
        var urlObj = { "original_url": req.params.query, "short_url": process.env.APP_URL + "/4" };
        res.send(urlObj);
        
    });
    
};