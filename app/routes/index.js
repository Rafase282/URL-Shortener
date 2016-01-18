'use strict';

module.exports = function (app, db) {
    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        });
    app.route('/:url*')
        .get(function(req, res) {
            var sites = db.collection('sites');
            var url = req.params.url;
            //sites.find({original_url: url.original_url});
            console.log(sites.find({original_url: url.original_url}));
            res.send(sites.url);
            //res.redirect(sites.url.original_url);
        });
    };