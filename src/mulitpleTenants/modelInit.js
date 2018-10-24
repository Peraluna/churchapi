'use strict';
/**
 * Created by moyofalaye on 3/17/14.
 */

var path = require('path');
var config = require('../../config/config');

// Globbing model files

config.getGlobbedFiles('./app/models/*.js').forEach(function (modelPath) {
    require(path.resolve(modelPath));

});



function modelsInit() {
    return function (req, res, next) {

//console.log(req.subdomains[0]);
        switch (req.subdomains[0]) {
            case 'www':
            case undefined:
                return next();
                break;
            case 'admin':
                return next();
                break;
//            default:
//              return
        }
        var clientname = req.session.Client.name;

    // test if models are not already compiled if so, skip
    if (/*typeof req.db === 'undefined' && */ typeof global.App.clientModel[clientname] === 'undefined') {
        req.db = {};
     //Get files from models directory
            config.getGlobbedFiles('./app/models/clientmodels/**/*.js').forEach(function (modelPath) {
            console.log('the filepath is ' + modelPath);
            //Deduce/ extrapulate model names from the file names
            //Im not very good with regxp but this is what i had to do, to get the names from the filename e.g users.server.models.js (this is my naming convention, so as not to get confused with server side models and client side models

            var filename = modelPath.replace(/^.*[\\\/]/, '');
            var fullname = filename.substr(0, filename.lastIndexOf('.'));
            var endname = fullname.indexOf('.');
            var name = fullname.substr(0, endname);
            req.db[name] = require(path.resolve(modelPath))(global.App.activdb);
            console.log('the filename is ' + name);
        });

        global.App.clientModel[clientname] = req.db;

        console.log(global.App.clients);

        return next();
    }
    // since models exist, pass it to request.db for easy consumption in controllers
    req.db = global.App.clientModel[clientname];
    return next();
    };
}

module.exports = modelsInit;