 # CHURCH API
 
 # WEB PACK  4  IS ADDED AFTER THE ABOVE TUTORIAL CODE IS COMPLETED

 WEBPACK will pack the code into one bundle : ./dist/main.js and main.js.map

TO INSTALL WEBPACK and all devDependencies use : npm i --save-dev _packagename_
where _packagename_ are :
  
    "ajv": "^6.5.2",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-preset-env": "^1.7.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "nodemon": "^1.12.1",
    "webpack": "^4.16.2",
    "webpack-cli": "^3.1.0",
    "webpack-dev-server": "^3.1.5",
    "webpack-node-externals": "^1.7.2"

 for instance (to install one ) : npm i --save-dev ajv
 to install multiple (replace ... with package names separated by space) :

 $ npm i --save-dev ajv babel-core ...


 to make the bundle : 
 
 $ npm run build

 and after that you can run the rest api app using :

 $ npm run prod.

 (see package.json and webpack.config.js for more information)


