So here are the goals this solution targets:

- each client is identified by subdomain e.g client1.application.com,
- application checks if subdomain is valid,
- application looks up and obtains connection information (database url, credentials, etc) from master database,
- application connects to client database ( pretty much hands over to client),
- application takes measures to ensure integrity and resource management (e.g use the same database connection for members of the same client, rather than make new connection).

updates :

- use of promises,
- automatic import & compilation of models
- New middleware ; modelsinit (used to automatically import and compile mongoose models)
- Clean up of middlewares (setclientdb, clientlistener, modelsInit)