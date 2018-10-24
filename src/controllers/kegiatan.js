const mongoose = require("mongoose")

const KegiatanModel = require('../models/kegiatan')
const TipeKegiatanModel = require('../models/tipekegiatan')
const func = require('../globalfunctions')
// const Globals = require('../globals')



exports.insert = (req, res, next) => {

  // from POSTMAN must use x-www-form-urlencoded
  // key-valuepair : rincianKegiatan [{"ketKegiatan":"SONG SERVICE","ket_pembawa_acara":"YANI"}, {"ketKegiatan":"Sekolah Sabat"","ket_pembawa_acara":"JOHN""}]

  console.log((req.body))
  const kegiatanbaru = new KegiatanModel({
    _id: new mongoose.Types.ObjectId(),
    namaKegiatan: req.body.namaKegiatan,
    _idTipeKegiatan: req.body._idTipeKegiatan,
     
    tglMulai: req.body.tglMulai,
    tglSelesai: req.body.tglSelesai,
    sudahSelesai: req.body.sudahSelesai,
    ketKegiatan: req.body.ketKegiatan,
    ketKegiatanPendek: req.body.ketKegiatanPendek,
    lokasi: req.body.lokasi,
    namaPenanggungJawab: req.body.namaPenanggungJawab,
    namaPembicara: req.body.namaPembicara,
    jumlahPersembahan: req.body.jumlahPersembahan,

    jumlahSumbangan: req.body.jumlahSumbangan,
    jumlahPerpuluhan: req.body.jumlahPerpuluhan,
    // fotoFoto: req.body.fotoFoto
    rincianKegiatan: JSON.parse(req.body.rincianKegiatan),
    youtubeTrailers: JSON.parse(req.body.youtubeTrailers),
    
  })

  // console.log("BODY : ", req.body)

  kegiatanbaru
    .save()
    .then(result => {
      // console.log("API RESULT : " + JSON.stringify(result))
      res.status(201).json({
        status: "ok",
        message: "Kegiatan berhasil ditambahkan",
        data: {
          document: result
        }
      })
    })

    .catch(err => {
      // console.log('Error in create anggota')
      // console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      });
    });
}



exports.select_all_by_dates = (req, res, next) => {
  var querySelection = "AAAA"


  const startDate = req.params.startDate
  const endDate = req.params.endDate

  console.log(startDate, endDate)
  var searchParams = {}

  searchParams["tglMulai"] = {
    $gte: startDate
  }
  searchParams["tglSelesai"] = {
    $lte: endDate
  }

  // if (startDate || endDate) {
  //   select = 
  // } else {
  //   if (startdate) {
  //     querySelection=`$and [{tglMulai: {$gte:"${startDate}"}},{tglSelesai: {$lte: "${startDate}"}} ]`
  //   } else {
  //     querySelection=''
  //   }
  // }
  // kegiatan.find().where('tglMulai').gt(startDate).and.("startDate")

  // PersonModel.find({"favouriteFoods.name": "Sushi"});

  //   async function getBartolomew() {
  //     const custStartWith_Bart = await Customers.find({name: /^Bart/ }); // Starts with Bart
  //     const custEndWith_lomew = await Customers.find({name: /lomew$/ }); // Ends with lomew
  //     const custContains_rtol = await Customers.find({name: /.*rtol.*/ }); // Contains rtol

  //     console.log(custStartWith_Bart);
  //     console.log(custEndWith_lomew);
  //     console.log(custContains_rtol);
  // }

  console.log("searchParams", searchParams)
  KegiatanModel.find(searchParams)
   // .select(fields.join(' '))

    .sort([
      ["tglMulai", 1],
      ["tglSelesai", 1]
    ])
    .populate('_idTipeKegiatan')
    .exec()
    .then(docs => {
      const response = {
        status: "ok",
        message: "",


        data: {
          count: docs.length,
          document: docs,
        },
        request: {
          type: req.method,
          url: req._remoteAddress,
          time: new Date().toISOString(),
          query: "kegiatan_get_all"
        }

      };

      res.status(200).json(response);

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err,
        request: {
          type: req.method,
          url: req._remoteAddress,
          query: "kegiatan_get_all"
        }
      });
    });
}



exports.select_by_bulan_tgl_mulai = (req, res, next) => {
  const startTime = process.hrtime()
  KegiatanModel.aggregate([{
        $project: {
          _id: 1,

         tglMulai: 1,
         namaKegiatan: 1,
          year: {
            $year: "$tglMulai"
          },
          month: {
            $month: "$tglMulai"
          }
        }
      },
      {
        $match: {

          "year": Number.parseInt(req.params.tahun),
          "month": Number.parseInt(req.params.bulan),
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
      return func.resStatusOkGet(req, res, 'berhasil', docs,startTime)

    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err)
    });
}
// exports.kegiatan_get_all_by_idtipekegiatan = (req, res, next) => {

//   var searchParams = {}

//   searchParams["_idTipeKegiatan"] = {
//     $eq: (req.params.id_tipe_kegiatan)
//   }

//   console.log(req.params.id_tipe_kegiatan)

//   KegiatanModel.find(searchParams)
//     .select(fields.join(' '))

//     .populate({
//       path: '_idTipeKegiatan',

//     })
//     .sort([
//       ["tglMulai", 1],
//       ["tglSelesai", 1]
//     ])
//     .exec()
//     .then(docs => {
//       const response = {
//         status: "ok",
//         message: "",


//         data: {
//           count: docs.length,
//           document: docs,
//         },
//         request: {
//           type: req.method,
//           url: req._remoteAddress,
//           time: new Date().toISOString(),
//           query: "kegiatan_get_all"
//         }

//       };

//       res.status(200).json(response);

//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         status: "error",
//         message: err,
//         request: {
//           type: req.method,
//           url: req._remoteAddress,
//           query: "kegiatan_get_all"
//         }
//       });
//     });
// }

exports.select_all_by_idtipekegiatan = (req, res, next) => {
  const startTime = process.hrtime()
  // SQL JOIN :
  // SELECT * FROM kegiatan where tipekegiatan in (SELECT _id from TipeKegiatan WHERE
  // _id=kegiatan.tipekegiatan and tipeKegiatan=req.params.tipeKegiatan)
  console.log(req.params.id_tipe_kegiatan)

  var _idTipeKegiatan = req.params.id_tipe_kegiatan 
  ids = mongoose.Types.ObjectId(_idTipeKegiatan)  

  // const  castId = (_Id) => mongoose.Types.ObjectId(_Id)
  
  console.log(ids)
  TipeKegiatanModel.aggregate([

    {
      $match: {
        "_id": {
          $eq:   ids
        }
      }
    },

      {
        $lookup: {
          from: "kegiatans",
          localField: "_id",
          foreignField: "_idTipeKegiatan",
          as: "filteredKegiatans"
        },

      },
      {
        $match: {
          "filteredKegiatans": {
            $ne: []
          }
        }
      },

    ])



    //   .sort([["tglMulai", 1],["tglSelesai",1]])
    //.exec()
    .then(docs => {
      return func.resStatusOkGet(req,res,docs,startTime)

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err,
        request: {
          type: req.method,
          url: req._remoteAddress,
          query: "kegiatan_get_all"
        }
      });
    });
}
 

exports.select = (req, res, next) => {
  KegiatanModel.findById(req.params.id)
    .select(fields.join(' '))
    .populate("_idTipeKegiatan") // query sub documents also
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          status: "error",
          message: "Kegiatan not found"
        })
      }
      res.status(200).json({
        status: "ok",
        message: "ok",
        data: {
          document: doc,

        },
        request: {
          type: req.method,
          url: req._remoteAddress,

        }
      })
    })
    .catch(err => {
      res.status(500).json({
        status: "error",
        message: err
      })
    })
}

exports.delete = (req, res, next) => {
  // console.log('req : ' , req)
  // console.log('params : ',req.params)
  console.log('body : ', req.body)
  const id = req.body.id;
  if (!id) {
    return res.json({
      status: "error",
      message: 'id not found',
      data: {
        id: id
      }
    });
  }

  KegiatanModel.findOneAndDelete({
      _id: id
    })
    .exec((err, doc) => {
      if (err) {
        return res.json({
          status: "error",
          message: 'Cannot remove doc'
        });
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
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      })
    })

};

exports.update_rincian = (req, res, next) => {
  // console.log("BODY : ", req.body.namaKegiatan)
  const jsonRincianKegiatan = JSON.parse(req.body.rincianKegiatan)

  // console.log(jsonRincianKegiatan)
  KegiatanModel.findOneAndUpdate({
      "_id": req.body.id_kegiatan,
      "rincianKegiatan._id": req.body.id_rincian
    }, {
      "$set": {

        // TO UPDATE ALL fields use : { "rincianKegiatan.$" : req.body.rincianKegiatan }
        // req.body.rincianKegiatan must be in JSON formatted string, ex : 
        //    {"ketKegiatan":"TESTUPDATE",
        //       "ket_pembawa_acara":"JACK",
        //       "jamMulai":"09:30",
        //       "jamSelesai":"10:30"}
        // to update just some fields just remove unneeded field from JSON data
        //
        // TO UPDATE ALL FIELDS, notice that _id will be changed, use :
        // "rincianKegiatan.$":  JSON.parse(req.body.rincianKegiatan),

        // UPDATE INDIVIDUAL FIELDS (_id will not be changed) :
        "rincianKegiatan.$.tgl_kegiatan": jsonRincianKegiatan.tgl_kegiatan,
        "rincianKegiatan.$.ketKegiatan": jsonRincianKegiatan.ketKegiatan,

        "rincianKegiatan.$.jamMulai": jsonRincianKegiatan.jamMulai,
        "rincianKegiatan.$.jamSelesai": jsonRincianKegiatan.jamSelesai,
        "rincianKegiatan.$.ket_pembawa_acara": jsonRincianKegiatan.ket_pembawa_acara,
      },
    }, {
      new: true
    }, ).then((doc, err) => {
      if (doc == null) {
        res.status(500).json({
          error: {
            message: "Document not found",
            id_kegiatan: req.body.id_kegiatan,
            id_rincian: req.body.id_rincian
          }
        })
        return
      }

      if (err) {
        console.log("Something wrong when updating data!");
        res.status(500).json({
          status: "error",
          message: err
        })
        return
      }

      res.status(200).json({
        status: "ok",
        message: "Rincian Kegiatan updated",
        data: {
          document: doc
        },
        request: {
          type: req.method,
          url: req._remoteAddress,

        }
      })

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      })
    })
}

exports.update_all_rincian = (req, res, next) => {
  console.log("BODY : ", req.body)
  const jsonRincianKegiatan = JSON.parse(req.body.rincianKegiatan)
  
  console.log(jsonRincianKegiatan)
  KegiatanModel.findOneAndUpdate({
        "_id": mongoose.Types.ObjectId(req.params.id),

      }, {
        "$set": {

          // OVERWRITE WITH NEW COLLECTION :
          // req.body.rincianKegiatan must be in JSON formatted string, ex : 
          //    [{"ketKegiatan":"KEGIATAN 1",
          //       "ket_pembawa_acara":"JACK",
          //       "jamMulai":"09:30",
          //       "jamSelesai":"10:30"},
          //     {"ketKegiatan":"KEGIATAN 2",
          //       "ket_pembawa_acara":"JACK",
          //       "jamMulai":"09:30",
          //       "jamSelesai":"10:30"}
          //    ]


          "rincianKegiatan": jsonRincianKegiatan,


        },

      },

      // {arrayFilters: [{"rincianKegiatan._id":   req.body.id_rincian }]},
      {
        new: true
      },


    ).then((doc, err) => {


      if (err) {
        console.log("Something wrong when updating data!");
        res.status(500).json({
          status: "error",
          message: err
        })
        return
      }
      if (doc == null) {
        res.status(404).json({
          status: "error",
          message: "Kegiatan Not Found",
          data: {
            id_kegiatan: req.body.id_kegiatan,

          },
          request: {
            type: req.method,
            url: req._remoteAddress,

          }
        })
        return
      }
      res.status(200).json({
        message: "rincian Kegiatan updated",
        request: {
          type: req.method,
          url: req._remoteAddress,
          body: doc,
        }
      })

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      })
    })
}

exports.delete_rincian = (req, res, next) => {
  KegiatanModel.findOneAndUpdate({
      "_id": req.body.id_kegiatan,
    }, {
      $pull: {
        rincianKegiatan: {
          _id: req.body.id_rincian
        }
      }
    }).then((doc, err) => {
      if (err) {
        console.log("Something wrong when deleting data!");
        res.status(500).json({
          status: "error",
          message: err
        })
        return
      }
      if (doc == null) {
        res.status(404).json({
          status: "error",
          message: "rincian Kegiatan Not Found",
          data: {
            id_kegiatan: req.body.id_kegiatan,
            id_rincian: req.body.id_rincian
          },
          request: {
            type: req.method,
            url: req._remoteAddress,

          }
        })
        return
      }

      res.status(200).json({
        status: "ok",
        message: "rincian Kegiatan deleted",
        data: {
          document: doc
        },
        request: {
          type: req.method,
          url: req._remoteAddress,

        }
      })

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      })
    })
}




exports.insert_rincian = (req, res, next) => {

  console.log(JSON.parse(req.body.rincianKegiatan))

  var json = JSON.parse(req.body.rincianKegiatan)


  KegiatanModel.findById({
      "_id": req.body.id_kegiatan,
    })
    .then((doc, err) => {
      if (err) {
        console.log("Something wrong when inserting data!");
        res.status(500).json({
          status: "error",
          message: err
        })
        return
      }
      if (doc == null) {
        return res.status(404).json({
          status: "error",
          message: "Kegiatan not found : id :" + req.body.id_kegiatan
        })
      }
      json.forEach(elem => {
        doc.rincianKegiatan.push(elem)
      })
      try {
        doc.save()
        res.status(200).json({
          status: "ok",
          message: "rincian Kegiatan inserted",
          data: {
            document: doc
          },
          request: {
            type: req.method,
            url: req._remoteAddress,

          }
        })
      } catch (error) {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: err
        })
      }


    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}



exports.update = (req, res, next) => {



  if (req.body.rincianKegiatan) {
    req.body.rincianKegiatan = JSON.parse(req.body.rincianKegiatan)
  }
  KegiatanModel.findOneAndUpdate({
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
        console.log("Something wrong when updating data!");
        res.status(500).json({
          status: "error",
          message: err

        })
        return
      }

      res.status(200).json({
        status: "ok",
        message: "Kegiatan berhasil disimpan",
        data: {
          document: doc
        },
        request: {
          type: req.method,
          url: req._remoteAddress,


        }
      })

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "error: " + err
      })
    })
}


exports.select_all_rincian = (req, res, next) => {
  const startTime = process.hrtime()

  KegiatanModel.find({
      "_id": (req.params.id),


    })
    .select("rincianKegiatan")
    .exec()
    .then((doc) => {
      if (doc == null) {
        return func.resStatusErrorProcess(req,res,"not found",req.params.id)
      }

      return func.resStatusOkGet(req,res,doc,startTime)

    })
    .catch(err => {
      return func.resStatusErrorServer(req,res,err)
    })
}