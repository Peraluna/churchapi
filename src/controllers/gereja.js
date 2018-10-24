const mongoose = require("mongoose");
const GerejaModel = require("../models/gereja");
 

exports.select_all = (req, res, next) => {
  
  GerejaModel.find()
 
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        ListGereja: docs.map(doc => {
          return {
       
            _id: doc._id,
            namaGereja : doc.namaGereja,
           
            alamat: doc.alamat,
            noTelpon: doc.noTelpon,
            namaPendetaPamong: doc.namaPendetaPamong,
            namaPendetaMuda: doc.namaPendetaMuda,
             
            request: {
              type: "GET",
              url: "http://localhost:5000/gereja/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.select_by_id = (req, res, next) => {
  // console.log("gereja_get_gereja API: BODY/HEADERS/PARAMS")
  // call ex : http://localhost:5000/gereja/getone/5b7a9969af2429057c1f12c5
  const id = req.params.id;
  // console.log("ID : " + id)
  // console.log(req.params)
   
    GerejaModel.findById(id)
    //.select(fields.join(' '))
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          gereja: doc,
          request: {
            type: "PATCH",
            url: "http://localhost:5000/gereja/getone"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID : " +id  });
      }
    })
    .catch(err => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.insert = (req, res, next) => {
  // console.log("CREATE gereja API: BODY/HEADERS/PARAMS")
  // console.log(req.body)
  // console.log(req.headers)
  // console.log(req.file)

  const gerejabaru = new GerejaModel({
    _id: new mongoose.Types.ObjectId(),
    namaGereja : req.body.namaGereja,
   
    alamat: req.body.alamat,
    namaPendetaPamong: req.body.namaPendetaPamong,
    namaPendetaMuda: req.body.namaPendetaMuda,
    noTelpon:req.body.noTelpon,
    
    fotoProfil: req.file.path
 
  });
   console.log(req.body)
  gerejabaru
    .save()
    .then(result => {
      // console.log("API RESULT : " + JSON.stringify( result))
      res.status(201).json({
        message: "Gereja berhasil ditambahkan",
        createdgereja: {
          result,
          request: {
            type: "POST",
            url: "http://localhost:5000/gereja/"  
          }
        }
      });
    })
    .catch(err => {
      // console.log('Error in create gereja')
      // console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.update = (req, res, next) => {
  // console.log("gereja_update_gereja API: BODY/HEADERS/PARAMS")
  //  console.log(req.body)
  // console.log(req.headers)
  console.log('fotopath : ',req.file)
  
  const id = req.body._id
 
  GerejaModel.findById(id)
    .select(fields.join(' '))
    .exec()
    .then(gereja => {
      // console.log("gereja from database : ", gereja)
      if (gereja) {
      
        gereja.namaGereja= req.body.namaGereja
      
        gereja.alamat = req.body.alamat
        gereja.namaPendetaPamong = req.body.namaPendetaPamong
        gereja.namaPendetaMuda = req.body.namaPendetaMuda
        gereja.noTelpon = req.body.noTelpon
       
        const oldFoto = gereja.fotoProfil
        if (req.file.path) {
          gereja.fotoProfil=req.file.path
        } else {oldFoto=''}

        // if (oldFoto!=='') {
        //   var globfunc = require('../globalfunctions.js')
        //   var imgfiledeleted = globfunc.deleteFile(oldFoto)
        //   console.log('File Deleted :' + imgfiledeleted) 
        // }
        //gereja.fotoProfil = fotopath
         
        //gereja.foto = req.file.path
        gereja.save() // will return updatedgereja if success
        .then((updatedgereja) => {
          if (oldFoto!=='') {
            var globfunc = require('../globalfunctions')
            var imgfiledeleted = globfunc.deleteFile(oldFoto)
            console.log('File Deleted :' + imgfiledeleted) 
          }
          res.status(200).json({
            message: 'OK',
            updatedgereja,
            request: {
              type: "PATCH",
              url: "http://localhost:5000/gereja/"  
              }  
          })
          return
      })
      .catch(err => {
        console.log('Error in create gereja')
        // console.log(err);
        res.status(500).json({
          error: err
        })
        return
      })
    }
  }
)}
 

 


exports.update_fotoprofil = (req, res, next) => {
  console.log("gereja_update_foto API: BODY/HEADERS/PARAMS")
  // console.log(req)
  // console.log(req.headers)
  // console.log(req.body)
  // console.log(req.file)
  const id = req.body._id
  // const updateOps = {
  //   'namaDepan': req.body.namaDepan,
  //   'tglLahir': req.body.tglLahir,
  //   'alamat': req.body.alamat,
  //   'foto': req.file.path
  // }
  GerejaModel.findById(id)
    .select("_id fotoProfil namaDepan namaLengkap")
    .exec()
    .then(gerejalama => {
      // console.log("gereja from database : ", gereja)
      if (gerejalama) {
        
        //gereja.foto = req.file.path
        return gerejalama
      
      } else {
        res.status(404).json({
           message: "No valid entry found for provided ID" 
          })
          return
      }
    })
    .then(gerejalama => {
      const oldfoto = gerejalama.fotoProfil
      gerejalama.fotoProfil = req.file.path
      gerejalama.save() // will return updatedgereja if success
      .then((updatedgereja) => {
        res.status(200).json({
          message: 'OK',
          updatedgereja,
           request: {
             type: "PATCH",
             url: "http://localhost:5000/gereja/"  
            }  
       })
       return oldfoto
      })
      .then(oldfoto =>{
        var globfunc = require('../globalfunctions')
        var imgfiledeleted = globfunc.deleteFile(oldfoto)
        console.log('File Deleted :' + imgfiledeleted)
       })
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
        return
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
      return
    })
}


exports.delete = (req, res, next) => {
  // console.log('req : ' , req)
  // console.log('params : ',req.params)
  // console.log('body : ' , req.body)
  const id = req.body.id;
  if (!id) {
    return res.json({success: false, msg: 'id is null'});
  }
   
  GerejaModel.findOneAndDelete({ id: id }) 
      .exec((err, item) => {
          if (err) {
              return res.json({success: false, msg: 'Cannot remove item'});
          }       
          if (!item) {
              return res.status(404).json({success: false, msg: 'id not found'})
          }  
          res.status(200).json({
            message: "gereja deleted",
            request: {
              type: "DELETE",
              url: "http://localhost:5000/gereja",
              body: result,
              idDeleted: id
            }
          })
      })
      .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            })
          })
 
};
 