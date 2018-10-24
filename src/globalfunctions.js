var pretty = require('pretty-time');

function deleteFile(filePath) {
  var fs = require('fs');
  
  try {
    fs.unlinkSync(filePath)
    return true
  } catch (error) {
    return false
  }
}

/* 
1xx (Informational): The request was received, continuing process
2xx (Successful): The request was successfully received, understood, and accepted
3xx (Redirection): Further action needs to be taken in order to complete the request
4xx (Client Error): The request contains bad syntax or cannot be fulfilled
5xx (Server Error): The server failed to fulfill an apparently valid request 
*/
function resStatusErrorServer(req,res,err,msg){
 
return  res.status(500).json({
  status: 'error server',
  error: {message : err.message},
  extendererror: err,
  
  request: {
    type: req.method,
    url: req._remoteAddress,
    time: new Date().toISOString(),
  }
});
}
function resStatusErrorProcess(req,res,msg,failedDocs,errCode,verbose=true){
  if (errCode==null) {
    errCode=300
  }
  if (verbose) {
    return  res.status(errCode).json({
      status: 'error : Further action needs to be taken in order to complete the request',
      message: msg,
    
      faileddocs : failedDocs,
      request: {
        type: req.method,
        url: req._remoteAddress,
        time: new Date().toISOString(),
      }
    })
  } else {
    return  res.status(errCode).json({
      status: 'error process',
      message: msg,
      request: {
        type: req.method,
        url: req._remoteAddress,
        time: new Date().toISOString(),
      }
    });
  }

  
  }

function resStatusOkGet(req,res,docs,startTime,verbose=true) {
  var resStatus
 
 

    
  

  if (verbose) {
   
    resStatus=res.status(200).json({
      status: "ok",
    
      parameters: req.params,
      
      count: docs.length,
      data: docs,   
      
      requestType: {
        type: req.method,
        
        type: req.method,
        url: req._remoteAddress,
       // startTime:pretty(startTime) ,
     
         elapsedTime: pretty(getElapsedTime(startTime))
      }
    })
  } else {
    res.status(200).json({
      status: "ok",
      message: msg,
      count: docs.length,
      data: docs,
    })
  }


  return  resStatus
}

function resStatusOkUpdates(req,res,msg,docs,successdocs,faileddocs,verbose=true) {
   
  var resStatus
  var successCount
  var failedCount
  var requestCount

  if (Array.isArray(successdocs)) {
    successCount=successdocs.length
  } else {
    if (isEmpty(successdocs)) {
      successCount=0
    }
    else {
      successCount=1
    }
  }
  if (Array.isArray(faileddocs)) {
    failedCount=faileddocs.length
  } else {
    if (isEmpty(faileddocs)) {
      failedCount=0
    }
    else {
      failedCount=1
    }
  }
  requestCount = successCount+failedCount
  

  if (verbose) {
    if (isEmpty(successdocs) || isEmpty(faileddocs)) {
      requestCount=1
      successCount=undefined
      failedCount=undefined
    }
    resStatus=res.status(200).json({
      status: "ok",
      message: msg,
      data: docs, 

     
      
      processedData: {
        parameters: req.params,
        queryCount: requestCount,
        successCount: successCount,
        failedCount: failedCount,
        successDocs:  successdocs,
        failedDocs :  faileddocs,
      },
  
      requestType: {
        type: req.method,
        url: req._remoteAddress,
        time: new Date().toISOString(),
      }
    })
  } else {
    res.status(201).json({
      status: "ok",
    })
  }


  return  resStatus
}

function getElapsedTime(startTime) {
  // startTime = System.currentTimeMillis()
  var end = new Date() - startTime,
  hrend = process.hrtime(startTime)

  // console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
        return  hrend 
}

 function isEmpty(obj) {
  //return !Object.keys(obj).length || obj==null || obj==undefined;
  if (obj==null || obj==undefined || obj==[]) {
    return true
  }
  return false    ;
}

function isNull(obj, defaultValue) {
  if (isEmpty(obj)) {
    return defaultValue
  }
  return obj
   
}

function objectIdWithTimestamp(timestamp) {

  // Convert date object to hex seconds since Unix epoch
  var hexSeconds = Math.floor(timestamp/1000).toString(16);

  // Create an ObjectId with that hex timestamp
  return ObjectId(hexSeconds + "0000000000000000");
  // Create a start and an end date for the month you're looking for:

// var start = objectIdWithTimestamp(new Date(2015, 01, 01));
// var end = objectIdWithTimestamp(new Date(2015, 01, 31));
}

function getDateYYYYMMD(dt) {

  var d = new Date(),
  hour = d.getHours(),
  min = d.getMinutes(),
  month = d.getMonth(),
  year = d.getFullYear(),
  sec = d.getSeconds(),
  day = d.getDate();

  if (isEmpty(dt)){
    dt=new Date();
  }


  return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
}

 function getNamaLengkap(nama_depan,nama_keluarga) {
   return nama_depan + ' ' + nama_keluarga
  }

 function getNamaLengkapGelar (gelar_depan,nama_depan,nama_keluarga,gelar_belakang) {return gelar_depan+ ' ' +nama_depan + ' ' + nama_keluarga + ((gelar_belakang === '') ? '' : ', '+ gelar_belakang)}


module.exports = {
  deleteFile: deleteFile,
  resStatusErrorProcess: resStatusErrorProcess,
  resStatusErrorServer:resStatusErrorServer,
  resStatusOkUpdates: resStatusOkUpdates,
  resStatusOkGet: resStatusOkGet,
  isEmpty:isEmpty,
  isNull: isNull,
  objectIdWithTimestamp:objectIdWithTimestamp,
  getDateYYYYMMD:getDateYYYYMMD,
  getNamaLengkap:getNamaLengkap,
  getNamaLengkapGelar:getNamaLengkapGelar

}

// usage :
// var globalFunc = require('./globalfunctions.js');
// console.log(globalFunc.deleteFile());
 