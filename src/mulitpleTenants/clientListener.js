var config = require('../../config/config');
var Clients = require('../models/clients');
var basedomain = config.baseDomain;
var allowedSubs = {'admin': true, 'www': true};
allowedSubs[basedomain] = true;

//console.dir(allowedSubs);

function clientlistener() {
    return function (req, res, next) {
        //check if client has already been recognized
        if (req.subdomains[0] in allowedSubs || typeof req.subdomains[0] == 'undefined' || req.session.Client && req.session.Client.name === req.subdomains[0]) {
            console.log('did not search database for ' + req.subdomains[0]);
            //console.log(JSON.stringify(req.session.Client, null, 4));
            return next();
        }

        //look for client in database
        else {

            Clients.findOne({subdomain: req.subdomains[0]}, function (err, client) {
                if (!err) {
                    //if client not found
                    if (!client) {
                        //res.send(client);
                        res.status(403).send('Sorry! you cant see that.');
                        console.log(client);
                    }
                    // client found, create session and add client
                    else {
                        console.log('searched database for ' + req.subdomains[0]);
                        req.session.Client = client;
                        return next();
                    }
                }
                else {
                    console.log(err);
                    return next(err)
                }

            });
        }

    }
}

module.exports = clientlistener;