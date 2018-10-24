const mongoose = require("mongoose")
const AnggotaModel = require("../models/anggota")
const func = require('../globalfunctions')
// const fields= [
//   "noAnggota", 
//   "statusDalamKeluarga",
//   "salut",
//   "gelarDepan",
//   "namaDepan",
//   "namaPanggilan",
//   "namaKeluarga",
//   "gelarBelakang",
//   "jenisKelamin",
//   "alamat",
//   "idKeluarga",
//   "tglBaptis",
//   "tglLahir",
//   "namaLengkap",
//   "namaLengkapGelar",
//   "fotoProfil"]

exports.select_all_by_nama = (req, res, next) => {
  const startTime = process.hrtime()
  var query = {
    $or: [{
      namaDepan: {
        $regex: req.params.namaDepan,
        $options: 'i'
      }
    }, {
      namaKeluarga: {
        $regex: req.params.namaKeluarga,
        $options: 'i'
      }
    }]
  }

  // var query = {$or: [{namaDepan:{$regex: req.params.namaDepan, $options: 'i'}} ] }

  AnggotaModel.find(query)
    //.select(fields.join(' '))
    .populate("_idKeluarga")
    .sort({
      namaDepan: 1,
      namaKeluarga: 1
    })
    .exec()
    .then(docs => {

      return func.resStatusOkGet(req, res, "ok", docs, startTime)
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       })
      //   }
    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err, err)
    })
}


exports.select_by_id = (req, res, next) => {
  const startTime = process.hrtime()
  // console.log("anggota_get_anggota API: BODY/HEADERS/PARAMS")
  // call ex : http://localhost:5000/anggota/getone/5b7a9969af2429057c1f12c5
  const id = req.params.id
  // console.log("ID : " + id)
  // console.log(req.params)

  AnggotaModel.findById(id)
    //.select(fields.join(' '))
    .exec()
    .then(doc => {
      console.log("From database", doc)
      if (doc) {
        return func.resStatusOkGet(req, res, doc, startTime)
      } else {
        return func.resStatusErrorProcess(req, res, "id not found", req.params.id)
      }
    })
    .catch(err => {
      // console.log(err)
      res.status(500).json({
        error: err
      })
    })
}





exports.select_hut_by_bulan = (req, res, next) => {
  const startTime = process.hrtime()
  var date = new Date()
  var curYear= date.getFullYear()
  console.log(( curYear   ))
  AnggotaModel.aggregate([{
        $project: {
          _id: 1,

          tglLahir: 1,
          alamat: 1,
          namaDepan:1,
          namaKeluarga:1,
          fotoProfil:1,
          namaLengkap: {
            $concat: ["$namaDepan", " ", "$namaKeluarga"]
          },
          month: {
            $month: "$tglLahir"
          },
          year: {
           $year: "$tglLahir"    
          }
        }
      },
      {
    
        $match: {
          "month": Number.parseInt(req.params.bulan),
          "year": {$ne:  ( curYear)}
 
            
        }
      },
      

      // {$project: {
      //   _id: 1,
      //   namaLengkap: 1,
      //   tglLahir: 1,
      //   alamat: 1,

      // }},
      //     {$group : { 
      //       _id : {month : "$month" ,year : "$year" },  

      // }}
    ])
    .then(docs => {
      return func.resStatusOkGet(req, res,  docs, startTime)

    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err, err)
    })
}


exports.select_hut_yearly = (req, res, next) => {
  const startTime = process.hrtime()
  AnggotaModel.aggregate([{
        $project: {
          _id: 1,

          tglLahir: 1,
          alamat: 1,
          namaLengkap: {
            $concat: ["$namaDepan", " ", "$namaKeluarga"]
          },
          month: {
            $month: "$tglLahir"
          }
        }
      },

      {
        $match: {
          "month": {
            $lte: 12
          } // Number.parseInt(req.params.bulan)
        }
      },


      {
        $group: {

          _id: {
            month: "$month"
          },

          count: {
            $sum: 1
          }

        },

      },
      {
        $unwind: '$_id'
      },
      {
        $unwind: '$count'
      },
      {
        $sort: {
          _id: 1
        }
      },
      {
        $project: {
          _id: 1,

          count: 1,


        }
      },
    ])
    .then(docs => {
      return func.resStatusOkGet(req, res, docs, startTime)

    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err, err)
    })
}

exports.insert = (req, res, next) => {
  // console.log("CREATE anggota API: BODY/HEADERS/PARAMS")
  // console.log(req.body)
  // console.log(req.headers)
  // console.log(req.file)
  // ----------------------------------------------------------------------
  // CHECKING INDIVIDUAL field is not null then update
  // ----------------------------------------------------------------------
  //    var objForUpdate = {};

  //    if (req.body.nome) objForUpdate.nome = req.body.nome;
  //    if (req.body.cognome) objForUpdate.cognome = req.body.cognome;

  //    objForUpdate = { $set: objForUpdate }

  //    collection.update({_id:ObjectId(req.session.userID)}, objForUpdate })
  // ----------------------------------------------------------------------
  // OR -- TO PROCESS ALL DATA IN BODY :
  // ----------------------------------------------------------------------
  //   collection.update(
  //     {_id: ObjectId(req.session.userID)},
  //     {$set: req.body }
  // )
  // Then whatever content you posted as fields is set within your update.

  // Note that use of set will only overwrite, or add new fields. 
  // If you just want to replace the whole document, then remove the whole {$set: (..) } 
  // notation and just pass in req body as it's a valild object.
  // ----------------------------------------------------------------------
  console.clear
  console.log("HEADERS : ", (req.headers))
  console.log("BODY : ", (req.body))
  var newAnggotaData = {}
  newAnggotaData._id = new mongoose.Types.ObjectId()


  if (req.body.noAnggota) {
    newAnggotaData.noAnggota = req.body.noAnggota
  }

  if (req.body.salut) {
    newAnggotaData.salut = req.body.salut
  } // Sdr., Pdt., PdtM., Ztr., Sdri.
  if (req.body.gelarDepan) {
    newAnggotaData.gelarDepan = req.body.gelarDepan
  } // Ir., Drs, Dr., DR.
  if (req.body.namaDepan) {
    newAnggotaData.namaDepan = req.body.namaDepan
  }
  if (req.body.namaPanggilan) {
    newAnggotaData.namaPanggilan = req.body.namaPanggilan
  }
  if (req.body.namaKeluarga) {
    newAnggotaData.namaKeluarga = req.body.namaKeluarga
  }
  if (req.body.gelarBelakang) {
    newAnggotaData.gelarBelakang = req.body.gelarBelakang
  } // Msc Mkes.




  if (req.body.tglLahir) {
    newAnggotaData.tglLahir = req.body.tglLahir
  }
  if (req.body.jenisKelamin) {
    newAnggotaData.jenisKelamin = req.body.jenisKelamin
  }
  if (req.body.tglBaptis) {
    newAnggotaData.tglBaptis = req.body.tglBaptis
  }

  if (req.body.statusPernikahan) {
    newAnggotaData.statusPernikahan = req.body.statusPernikahan
  }
  if (req.body.pekerjaan) {
    newAnggotaData.pekerjaan = req.body.pekerjaan
  }
  if (req.body.bidangPekerjaan) {
    newAnggotaData.bidangPekerjaan = req.body.bidangPekerjaan
  }

  if (req.body.alamat) {
    newAnggotaData.alamat = req.body.alamat
  }
  if (req.body.noTelpon) {
    newAnggotaData.noTelpon = req.body.noTelpon
  }
  if (req.body.email) {
    newAnggotaData.email = req.body.email
  }
  if (req.body.minat) {
    newAnggotaData.minat = JSON.parse(req.body.minat)
  }
  if (req.body.keahlian) {
    newAnggotaData.keahlian = JSON.parse(req.body.keahlian)
  }

  if (req.body._idKeluarga) {
    newAnggotaData._idKeluarga = req.body._idKeluarga
  }
  if (req.body.statusDalamKeluarga) {
    newAnggotaData.statusDalamKeluarga = req.body.statusDalamKeluarga
  }

  if (req.file) {
    newAnggotaData.fotoProfil = req.file.path
  } else {
    console.log("no image uploaded")
  }


  // newAnggotaData.keahlian=[]
  // for (var i in req.body.keahlian) {
  //   var elem = req.body.keahlian[i]
  //   anggotabaru.keahlian.push(elem)
  // } 



  // console.log("FOTO : " , req.file.path)
  // console.log(newAnggotaData)
  console.log(newAnggotaData)

  const anggotabaru = new AnggotaModel(newAnggotaData)



  anggotabaru
    .save()
    .then(result => {
      console.log("API RESULT : " + JSON.stringify(result))
      return func.resStatusOkUpdates(req, res, "Anggota berhasil ditambahkan", result)

    })
    .catch(err => {

      console.log('ERROR : update_id_keluarga', err)
      return func.resStatusErrorServer(req, res, err, err)

    })
}

exports.update = (req, res, next) => {
  // console.log("anggota_update_anggota API: BODY/HEADERS/PARAMS")
  console.log(typeof req.body.minat)
  // console.log(req.headers)




  var fotoProfilLama
  const id = req.body._id
  AnggotaModel.findById(id)
    //.select(fields.join(' '))
    .exec()
    .then((anggota) => {
      // req.body.forEach(element => {
        
      // });
      if (anggota) {

        for (var key in req.body) {
          console.log(key, " : ", req.body[key])

          if ((key == "minat" || key == "keahlian")) {
            // console.log(typeof AnggotaModel.minat)
            anggota[key] = JSON.parse(req.body[key])

          } else {
            anggota[key] = req.body[key]
          }
        }


        if (req.file) {
          if (anggota.fotoProfil) {
            fotoProfilLama = anggota.fotoProfil
          }
          anggota.fotoProfil = req.file.path
          console.log(req.file.path)
        } else {
          console.log("No Foto Profil uploaded")
        }
        anggota.save() // will return updatedAnggota if success
          .then((updatedAnggota) => {

            if (updatedAnggota.fotoProfil) {

              if (fotoProfilLama) {
                var deleter = require('../globalfunctions')
                if (!deleter.deleteFile(fotoProfilLama)) {
                  console.log("Foto Lama tidak ditemukan")
                } else {
                  console.log("FotoProfil lama dihapus")
                }
              }
            }
            return func.resStatusOkUpdates(req, res, "Update anggota berhasil disimpan", updatedAnggota)
          })
          .catch(err => {
            return func.resStatusErrorServer(req, res, err, err)
          })

      } else {
        return func.resStatusErrorProcess(req, req, "Anggota tidak ditemukan", req.body, 404)
      }


    })
    .catch(err => {
      // const errMs = err.message
      console.log('Error in : update => ')
      return func.resStatusErrorServer(req, res, err, err)

    })


}


// exports.update_dynamic_body_fields = (req, res, next) => {
//   var newUser = new userModel(req.body)
// AnggotaModel.findOneAndUpdate({_id: req.params.id}, req.body ,{ new: true, 

// upsert:true, setDefaultsOnInsert: true }, function (err, userUpdate) {

// return res.json(userUpdate)
// }




exports.update_dynamic_body_fields = function (req, res) {
  var updatedAnggota = new AnggotaModel(req.body)
  console.log(req.body.minat)
  const minat = JSON.parse(req.body.minat)
  const keahlian = JSON.parse(req.body.keahlian)

  //mongoose.Types.ObjectId
  AnggotaModel.findOneAndUpdate({
      "_id": mongoose.Types.ObjectId(req.params.id)
    }, {
      //$push : { "minat": minat } ,
      $set: {
        minat: minat,
        keahlian: keahlian,
        alamat: req.body.alamat
      }
    }, {
      new: true
    })
    .then((docs, err) => {
      return func.resStatusOkUpdates(req, res, "Anggota tersimpan", docs)

    })

    .catch((err) => {
      {
        console.log('Error in : update_dynamic_body_fields')
        // console.log(err)
        return func.resStatusErrorServer(req, res, err, err)
      }
    })



}


exports.update_id_keluarga = (req, res, next) => {
  // console.log("anggota_update_anggota API: BODY/HEADERS/PARAMS")
  //  console.log(req.body)
  // console.log(req.headers)


  const id = req.body._id

  const idkeluarga = req.body._idKeluarga

  AnggotaModel.findById(id)

    .exec()
    .then(anggota => {
      // console.log("anggota from database : ", anggota)
      if (anggota) {


        anggota._idKeluarga = req.body._idKeluarga
        anggota.alamat = req.body.alamat

        anggota.save() // will return updatedAnggota if success
          .then((updatedAnggota) => {

            return func.resStatusOkUpdates(req, res, "Id Keluarga tersimpan", updatedAnggota)
          })
          .catch(err => {
            console.log('Error in : update_id_keluarga')
            // console.log(err)
            return func.resStatusErrorServer(req, req, err, err)
          })
      } else {
        return func.resStatusErrorProcess(req, res, "Anggota tidak ditemukan", req.body, 404)
      }
    })
}



exports.update_fotoprofil = (req, res, next) => {
  console.log("anggota_update_foto API: BODY/HEADERS/PARAMS")
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
  AnggotaModel.findById(id)
    .select("_id fotoProfil  namaDepan namaKeluarga")
    .exec()
    .then(anggotalama => {
      // console.log("anggota from database : ", anggota)
      if (anggotalama) {

        //anggota.foto = req.file.path
        const oldfoto = anggotalama.fotoProfil
        anggotalama.fotoProfil = req.file.path
        anggotalama.save() // will return updatedAnggota if success
          .then((updatedAnggota) => {

            return func.resStatusOkUpdates(req, res, "fotoProfil updated", updatedAnggota)
          })
          .then(oldfoto => {

            var imgfiledeleted = func.deleteFile(oldfoto)
            console.log('File Deleted :' + imgfiledeleted)
          })
          .catch(err => {

            return func.resStatusErrorServer(req, res, err, err)
          })

      } else {

        return func.resStatusErrorProcess(req, res, "id keluarga not found", req.params, 404)
      }
    })

    .catch(err => {
      return func.resStatusErrorServer(req, res, err, err)
    })
}


exports.delete = (req, res, next) => {
  // console.log('req : ' , req)
  // console.log('params : ',req.params)
  // console.log('body : ' , req.body)
  const id = req.body.id
  if (!id) {
    return res.json({
      success: false,
      msg: 'id is null'
    })
  }

  AnggotaModel.findOneAndDelete({
      id: id
    })
    .exec((err, item) => {
      if (err) {
        return res.json({
          success: false,
          msg: 'Cannot remove item'
        })
      }
      if (!item) {
        return func.resStatusErrorProcess(req, res, "id Anggota tidak ditemukan", id, 404)
      }
      return func.resStatusOkUpdates(req, res, "Anggota terhapus", id)
    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err, err)
    })

}