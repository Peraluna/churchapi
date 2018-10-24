const mongoose = require("mongoose")

const KeluargaModel = require('../models/keluarga')
const AnggotaModel = require('../models/anggota')
const func = require('../globalfunctions')
const fs = require('fs')
// const fields = [
//   noAnggota 
// statusDalamKeluarga 
// salut 
// gelarDepan 
// namaDepan 
// namaPanggilan 
// namaKeluarga 
// gelarBelakang 
// jenisKelamin 
// alamat 
// _idKeluarga 
// tglBaptis 
// tglLahir 
// pekerjaan 
// bidangPekerjaan 
// statusPernikahan 
// id_keluarga 
// noTelpon 
// email 
// _idUser 
// ]

// const Globals = require('../globals')



exports.insert = (req, res, next) => {

  // from POSTMAN must use x-www-form-urlencoded
  // key-valuepair : rincian_keluarga [{"ket_keluarga":"SONG SERVICE","ket_pembawa_acara":"YANI"}, {"ket_keluarga":"Sekolah Sabat"","ket_pembawa_acara":"JOHN""}]

  console.log((req.body))
  const keluargabaru = new KeluargaModel({
    _id: new mongoose.Types.ObjectId(),
    namaKeluarga: req.body.namaKeluarga,
    alamat: req.body.alamat,
    //_idUser:req.body

  })

  // console.log("BODY : ", req.body)

  keluargabaru
    .save()
    .then(result => {
      // console.log("API RESULT : " + JSON.stringify(result))
      res.status(201).json({
        status: "ok",
        message: "Keluarga berhasil ditambahkan",
        data: {
          document: result
        }
      })
    })

    .catch(err => {
      // console.log('Error in create anggota')
      // console.log(err)
      res.status(500).json({
        status: "error",
        message: err
      })
    })
}



 
  exports.select_all_by_nama = (req, res, next) => {
    const startTime = process.hrtime()
    var query = {
      $or: [{
        namaKeluarga: {
          $regex: req.params.namaKeluarga,
          $options: 'i'
        }
      }, ]
    }
  
    // var query = {$or: [{namaDepan:{$regex: req.params.namaDepan, $options: 'i'}} ] }
  
    KeluargaModel.find(query)
      //.select(fields.join(' '))
      //.populate("anggotaKeluarga")
      .sort({
         
        namaKeluarga: 1,
      })
      .exec()
      .then(docs => {
       
        return  func.resStatusOkGet(req,res, docs,startTime)
  
      })
      .catch(err => {
         return func.resStatusErrorServer(req,res,err)
      })
  }



exports.select = (req, res, next) => {
  const startTime = process.hrtime()
  KeluargaModel.findById(req.params.id)
    .select(fields.join(' '))
    //.populate("_id_tipe_keluarga") // query sub documents also
    .exec()
    .then(doc => {
      if (!doc) {
        return func.resStatusErrorProcess(req, res, "id keluarga not found", null, 404)
      }
      return func.resStatusOkGet(req, res,   doc, startTime)
    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err)
    })
}



exports.delete = (req, res, next) => {
  // console.log('req : ' , req)
  // console.log('params : ',req.params)
  console.log('body : ', req.body)
  const id = req.body.id
  if (!id) {
    return res.json({
      status: "error",
      message: 'id not found',
      data: {
        id: id
      }
    })
  }

  KeluargaModel.findOneAndDelete({
      _id: id
    })
    .exec((err, doc) => {
      if (err) {
        return res.json({
          status: "error",
          message: 'Cannot remove doc'
        })
      }
      if (!doc) {
        return res.status(404).json({
          status: "error",
          message: 'id not found',
          data: {
            id: id
          }
        })
      }
      res.status(200).json({
        status: "ok",
        message: "Kegiatan deleted",
        data: {

          document: doc,
          deletedId: id
        },
        request: {
          type: req.method,
          url: req._remoteAddress,

        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        status: "error",
        message: err
      })
    })

}


exports.update = (req, res, next) => {



  if (req.body.rincian_keluarga) {
    req.body.rincian_keluarga = JSON.parse(req.body.rincian_keluarga)
  }
  KeluargaModel.findOneAndUpdate({
      "_id": (req.params.id),

    }, {
      "$set":
        //json
        req.body // only update fields that are in req.body list, other fields that are not specified in re.body will stay the same
        ,
    }, {
      new: true
    }, ).then((doc, err) => {
      if (doc == null) {
        res.status(404).json({
          status: "error",
          message: "Document not found : " + req.params.id
        })
        return
      }

      if (err) {
        console.log("Something wrong when updating data!")
        res.status(500).json({
          status: "error",
          message: err

        })
        return
      }

      res.status(200).json({
        status: "ok",
        message: "Keluarga berhasil disimpan",
        data: {
          count: docs.length,
          document: docs,
        },
        request: {
          type: req.method,
          url: req._remoteAddress,


        }
      })

    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "error: " + err
      })
    })
}

exports.update_fotoprofil = (req, res, next) => {
  console.log("anggota_update_foto API: BODY/HEADERS/PARAMS")
  // console.log(req)
  // console.log(req.headers)
  // console.log(req.body)
  // console.log(req.file)
  const id = req.params.id
  // const updateOps = {
  //   'namaDepan': req.body.namaDepan,
  //   'tglLahir': req.body.tglLahir,
  //   'alamat': req.body.alamat,
  //   'foto': req.file.path
  // }
  KeluargaModel.findById(id)
    .select("_id fotoProfil namaKeluarga")
    .exec()
    .then(docLama => {
      // console.log("anggota from database : ", anggota)
      if (!docLama) {


        return func.resStatusErrorProcess(req, res, "id keluarga not found", req.params, 404)
      }

      const oldfoto = docLama.fotoProfil
      docLama.fotoProfil = req.file.path
      docLama.save() // will return updatedanggota if success
        .then((newDoc) => {
          var imgfiledeleted = func.deleteFile(oldfoto)
          console.log('File Deleted :' + imgfiledeleted)
          return func.resStatusOkUpdates(req, res, "fotoProfil updated", newDoc)
        })


    })

    .catch(err => {
      return func.resStatusErrorServer(req, res, err)
    })
}

exports.select_with_anggota = (req, res, next) => {
  const startTime = process.hrtime()
  console.log(startTime)
  // SQL JOIN :
  // SELECT * FROM kegiatan where tipekegiatan in (SELECT _id from TipeKegiatan WHERE
  // _id=kegiatan.tipekegiatan and tipeKegiatan=req.params.tipeKegiatan)
  console.log(req.params.id)


  ids = mongoose.Types.ObjectId(req.params.id)

  // const  castId = (_Id) => mongoose.Types.ObjectId(_Id)
 
  KeluargaModel.aggregate([

      {
        $match: {
          "_id": {
            $eq: ids
          }
        }
      },

      {
        $lookup: {
          from: "anggotas",
          localField: "_id",
          foreignField: "_idKeluarga",
          as: "anggotaKeluarga"
        },

      },
      {
        $match: {
          "anggotaKeluarga": {
            $ne: []
          }
        }
      },
      {$sort :  {namaKeluarga : 1} },
    ])



    //   .sort([["tglMulai", 1],["tglSelesai",1]])
    //.exec()
    .then(docs => {
      console.log(docs)
      return func.resStatusOkGet(req, res, docs,startTime)

    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err)
    })
}


exports.select_by_name_with_anggota = (req, res, next) => {
  console.clear;
  const startTime = process.hrtime()
  console.log(startTime)

  // SQL JOIN :
  // SELECT * FROM kegiatan where tipekegiatan in (SELECT _id from TipeKegiatan WHERE
  // _id=kegiatan.tipekegiatan and tipeKegiatan=req.params.tipeKegiatan)
  
  var namaKeluarga = req.params.namaKeluarga
  if (namaKeluarga=="~") {
    namaKeluarga=""
  }
 

  // const  castId = (_Id) => mongoose.Types.ObjectId(_Id)
 
  KeluargaModel.aggregate([
    
      {
        $match: {
          namaKeluarga: {
            $regex: namaKeluarga,
            $options: 'i'
          }
        }
      },

      {
        $lookup: {
          from: "anggotas",
          localField: "_id",
          foreignField: "_idKeluarga",
          as: "anggotaKeluarga"
        },

      },
      {$sort :  {namaKeluarga : 1} },
      // {
      //   $match: {
      //     "anggotaKeluarga": {
      //       $ne: []
      //     }
      //   }
      // },

    ])



    //   .sort([["tglMulai", 1],["tglSelesai",1]])
    //.exec()
    .then(docs => {
      console.log(docs)
      //next(func.resStatusOkGet(req, res, docs,startTime))
      return func.resStatusOkGet(req, res, docs,startTime)

    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err)
    })
}

exports.get_image = (req, res, next) => {
  const imageName=req.params.imageName
  console.log(imageName)
  fs.readFile("./uploads/fotoprofilkeluarga/"+imageName, function(err, data) {
    if (err)  
      {
        return func.resStatusErrorServer(req,res,err)
      }
     
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(data); // Send the file data to the browser.
    
      
  });

}