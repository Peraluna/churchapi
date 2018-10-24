var client;
            var clientname;
            var activedb;

            var Promise = require("bluebird");
            Promise.promisifyAll(require("mongoose"));
            //mongoose = require('mongoose');


            function setclientdb() {
                return function (req, res, next) {
                    //check if client is not valid
                    if (typeof(req.session.Client) === 'undefined' || req.session.Client && req.session.Client.name !== req.subdomains[0]) {
                        delete req.session.Client;
                        client = false;
                        return next();
                    }
                    //if client already has an existing connection make it active
                    else if (global.App.clients.indexOf(req.session.Client.name) > -1) {
                        global.App.activdb = global.App.clientdbconn[req.session.Client.name]; //global.App.clientdbconnection is an array of or established connections
                        console.log('did not make new connection for ' + req.session.Client.name);
                        return next();
                    }
                    //make new db connection
                    else {
                        console.log('setting db for client ' + req.subdomains[0] + ' and ' + req.session.Client.dbUrl);
                        client = mongoose.createConnection(req.session.Client.dbUrl /*, dbconfigoptions*/);
                        client.on('connected', function () {
                            console.log('Mongoose default connection open to  ' + req.session.Client.name);
                            //If pool has not been created, create it and Add new connection to the pool and set it as active connection
                            if (typeof(global.App.clients) === 'undefined' || typeof(global.App.clients[req.session.Client.name]) === 'undefined' && typeof(global.App.clientdbconn[req.session.Client.name]) === 'undefined') {
                                clientname = req.session.Client.name;
                                global.App.clients.push(req.session.Client.name);// Store name of client in the global clients array
                                activedb = global.App.clientdbconn[clientname] = client; //Store connection in the global connection array and set it as the current active database
                                console.log('I am now in the list of active clients  ' + global.App.clients[clientname]);
                                global.App.activdb = activedb;
                                console.log('client connection established, and saved ' + req.session.Client.name);
                                return next();
                            }
                        });
                        // When the connection is disconnected
                        client.on('disconnected', function () {
                            console.log('Mongoose ' + req.session.Client.name + ' connection disconnected');
                        });

                        // If the Node process ends, close the Mongoose connection
                        process.on('SIGINT', function () {
                            client.close(function () {
                                console.log(req.session.Client.name + ' connection disconnected through app termination');
                                process.exit(0);
                            });
                        });
                    }


                }
            }

            module.exports = setclientdb;