'use strict';

module.exports = function(app) {

    app.get('/:query', function(req, res) {
        var ota = { "original_url": req.params.query, "short_url": process.env.APP_URL + "/4" };
        res.send(ota);
        
    });
    
};