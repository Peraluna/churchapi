const mongoose = require("mongoose");
const KelompokModel = require("../models/kelompok");
const AnggotaModel = require("../models/anggota");
const func = require("../globalfunctions");

exports.insert = (req, res, next) => {
  // from POSTMAN must use x-www-form-urlencoded
  // key-valuepair : anggotaKelompok [{"ketKelompok":"SONG SERVICE","ket_pembawa_acara":"YANI"}, {"ketKelompok":"Sekolah Sabat"","ket_pembawa_acara":"JOHN""}]
  console.log(req.body);
  // var kelompokbaru = {}
  // kelompokbaru._id = new mongoose.Types.ObjectId()

  // if (req.body.namaKelompok) {
  //   kelompokbaru.namaKelompok = req.body.namaKelompok
  // }
  // if (req.body.ketKelompok) {
  //   kelompokbaru.ketKelompok = req.body.ketKelompok
  // }
  // if (req.body.tglDibentuk) {
  //   kelompokbaru.tglDibentuk = req.body.tglDibentuk
  // }
  // if (req.body.tujuanKelompok) {
  //   kelompokbaru.tujuanKelompok = req.body.tujuanKelompok
  // }
  // if (req.body.tujuanKelompok) {
  //   kelompokbaru.tujuanKelompok = req.body.tujuanKelompok
  // }

  const kelompokbaru = new KelompokModel({
    _id: new mongoose.Types.ObjectId(),
    namaKelompok: req.body.namaKelompok ? req.body.namaKelompok : "",

    tglDibentuk: req.body.tglDibentuk ? req.body.tglDibentuk : null,

    ketKelompok: req.body.ketKelompok ? req.body.ketKelompok : "",

    tujuanKelompok: req.body.tujuanKelompok ? req.body.tujuanKelompok : "",
    jenisKelompok: req.body.jenisKelompok ? req.body.jenisKelompok : "",

    _idPemimpinKelompok: req.body._idPemimpinKelompok
      ? req.body._idPemimpinKelompok
      : null,

    anggotaKelompok: !func.isEmpty(req.body.anggotaKelompok)
      ? JSON.parse(req.body.anggotaKelompok)
      : []
  });

  // console.log("BODY : ", req.body)

  kelompokbaru
    .save()
    .then((result, err) => {
      // console.log("API RESULT : " + JSON.stringify(result))
      console.log(result);

      return func.resStatusOkUpdates(
        req,
        res,
        "Kelompok berhasil ditambahkan",
        result,
        result
      );
      // res.status(201).json({
      //   status: "ok",
      //   message: "Kelompok berhasil ditambahkan",
      //   data: {
      //     document: result
      //   }
      // })
    })

    .catch(err => {
      // console.log('Error in create anggota')
      console.log(err);
      return func.resStatusErrorServer(req, res, err);
      // res.status(500).json({
      //   status: "error",
      //   message: err
      // });
    });
};

exports.select_all = (req, res, next) => {
  const startTime = process.hrtime();
  var querySelection = "AAAA";

  var searchParams = {};

  KelompokModel.find(searchParams)
    // .select(fields.join(' '))

    .sort([["namaKelompok", 1]])
    .populate("anggotaKelompok")
    .exec()
    .then(docs => {
      // const response = {
      //   status: "ok",
      //   message: "",

      //   data: {
      //     count: docs.length,
      //     document: docs,
      //   },
      //   request: {
      //     type: req.method,
      //     url: req._remoteAddress,
      //     time: new Date().toISOString(),

      //   }

      // };
      return func.resStatusOkGet(req, res, docs, startTime);
      //res.status(200).json(response);
    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err);
    });
};

exports.select_all_by_idanggota = (req, res, next) => {
  const startTime = process.hrtime();

  console.log(req.params._idAnggota);

  KelompokModel.aggregate([
    {
      $unwind: "$anggotaKelompok"
    },
    //{$unwind: '$kelompoks.anggotaKelompok'},
    //{$project:{"_idAnggota": "$kelompoks.anggotaKelompok._idAnggota" }},
    //{ $group: {_id: '$_idAnggota', count: {'$sum': 1} }},

    {
      $match: {
        "anggotaKelompok._idAnggota": mongoose.Types.ObjectId(
          req.params._idAnggota
        )
      }
    }
  ])
    .then(docs => {
      return func.resStatusOkGet(req, res, docs, startTime);
    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err);
    });
};

exports.select = (req, res, next) => {
  const startTime = process.hrtime();
  KelompokModel.findById(req.params.id)
    .select(fields.join(" "))
    .populate("anggotaKelompok") // query sub documents also
    .exec()
    .then(doc => {
      if (!doc) {
        return func.resStatusErrorProcess(req, res, "not found", req.params.id);
      }
      return func.resStatusOkGet(req, res, doc, startTime);
    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err);
    });
};

exports.select_all_by_nama = (req, res, next) => {
  const startTime = process.hrtime();
  var query = {
    $or: [
      {
        namaKelompok: {
          $regex: req.params.namaKelompok,
          $options: "i"
        }
      }
    ]
  };

  // var query = {$or: [{namaDepan:{$regex: req.params.namaDepan, $options: 'i'}} ] }

  KelompokModel.find(query)
    //.select(fields.join(' '))
    //.populate("anggotaKelompok")
    .sort({
      namaKelompok: 1
    })
    .exec()
    .then(docs => {
      return func.resStatusOkGet(req, res, docs, startTime);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       })
      //   }
    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err);
    });
};

exports.select_by_name_with_anggota = (req, res, next) => {
  const startTime = process.hrtime();
  var namaKelompok = req.params.namaKelompok;
  if (namaKelompok == "~") {
    namaKelompok = "";
  }
  var query = {
    $or: [
      {
        namaKelompok: {
          $regex:  namaKelompok,
          $options: "i"
        }
      }
    ]
  };
  KelompokModel.find(query)
    //.select(fields.join(' '))
    //.select('_id namaKelompok jabatan tglJabatan anggotaKelompok')
    //.lean()
    .populate(
      {
        // path: "anggotaKelompok._idAnggota",
        // localField: "_idAnggota",
        // foreignField: "_id",
        // model: "Anggota",
             //  alias: "rincianAnggota",
         path: "anggotaKelompok._idAnggota",
   
        select: "salut namaDepan namaKeluarga noTelpon alamat email fotoProfil",
        //model: 'Anggota',
      } 

      // Nested Population : Model.findOne({_id: 'foo'}).populate({ path: 'parent-model', populate: { path: 'someProperty', populate: { path: 'somePropertyBelow' } } })
    )
    .exec()
    .then(doc => {
      if (!doc) {
        return func.resStatusErrorProcess(req, res, "not found", req.params.id);
      }
      return func.resStatusOkGet(req, res, doc, startTime);
    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err);
    });
};

// exports.select_by_name_with_anggota = (req, res, next) => {
//   console.clear;
//   const startTime = process.hrtime()
//   console.log(startTime)

//   // SQL JOIN :
//   // SELECT * FROM kegiatan where tipekegiatan in (SELECT _id from TipeKegiatan WHERE
//   // _id=kegiatan.tipekegiatan and tipeKegiatan=req.params.tipeKegiatan)

//   var namaKelompok = req.params.namaKelompok
//   if (namaKelompok == "~") {
//     namaKelompok = ""
//   }

//   // const  castId = (_Id) => mongoose.Types.ObjectId(_Id)

//   KelompokModel.aggregate([

//       {
//         $match: {
//           namaKelompok: {
//             $regex: namaKelompok,
//             $options: 'i',

//           }
//         }
//       },
//       // {$unwind: "$anggotaKelompok"}, //-->THIS WILL CREATE SEPARATE ROWS FOR EACH ANGGOTA OF THE SAME KELOMPOK.
//       //db.coll.aggregate([{$docUnwind: {id: 0}},  // syntax similar to $project for whitelisting or blacklisting which fields to unwind
//       // ])
//       {$unwind: '$anggotaKelompok'},
//       {
//         $project: {
//           _id: "$_id",
//           namaKelompok: 1 ,
//           anggotaKelompok: 1,
//           // _idAnggota: "$anggotaKelompok._idAnggota",
//           // namaDepan: "$anggotaKelompok.namaDepan",
//           // jabatan: "$anggotaKelompok.jabatan",
//           // tglJabatan: "$anggotaKelompok.tgljabatan",
//         },
//       },

//       {
//         $lookup: {
//           from: "anggotas", // other table name
//           localField: "anggotaKelompok._idAnggota", // name of users table field
//           foreignField: "_id", // name of userinfo table field
//           as: "anggotaInfo" // alias for userinfo table
//         }
//       },

//       // {$project: {kelompoks: 1, doc: {_id:"$_id", namaKelompok:"$namaKelompok", anggotaKelompok:"$anggotaKelompok"}}},
//       //{$unwind: '$doc.anggotaKelompok'},
//       // {$project: { _id: 1,namaKelompok:1,tujuanKelompok:1,ketKelompok:1, tglDibentuk:1, jenisKelompok:1, anggotaKelompok:1}},

//       //{$unwind: '$doc.anggotaKelompok'},

//       // {
//       //   $lookup: {
//       //     from: "anggotas",
//       //     localField: "anggotaKelompok._idAnggota",
//       //     foreignField: "_id",
//       //     as: "rincianAnggota"
//       //   },

//       // },
//       {
//         $sort: {
//           namaKelompok: 1
//         }
//       },
//       // {
//       //   $match: {
//       //     "anggotaKelompok": {
//       //       $ne: []
//       //     }
//       //   }
//       // },

//     ])

//     //   .sort([["tglMulai", 1],["tglSelesai",1]])
//     //.exec()
//     .then(docs => {
//       console.log(docs)
//       //next(func.resStatusOkGet(req, res, docs,startTime))
//       return func.resStatusOkGet(req, res, docs, startTime)

//     })
//     .catch(err => {
//       return func.resStatusErrorServer(req, res, err)
//     })
// }

exports.get_image = (req, res, next) => {
  const imageName = req.params.imageName;
  console.log(imageName);
  fs.readFile("./uploads/fotoprofilkelompok/" + imageName, function(err, data) {
    if (err) {
      return func.resStatusErrorServer(req, res, err);
    }

    res.writeHead(200, {
      "Content-Type": "image/jpeg"
    });
    res.end(data); // Send the file data to the browser.
  });
};
exports.delete = (req, res, next) => {
  // console.log('req : ' , req)
  // console.log('params : ',req.params)
  console.log("body : ", req.body);
  const id = req.body.id;
  if (!id) {
    return res.json({
      status: "error",
      message: "id not found",
      data: {
        id: id
      }
    });
  }

  KelompokModel.findOneAndDelete({
    _id: id
  })
    .exec((err, doc) => {
      if (err) {
        return res.json({
          status: "error",
          message: "Cannot remove doc"
        });
      }
      if (!doc) {
        return res.status(404).json({
          status: "error",
          message: "id not found",
          data: {
            id: id
          }
        });
      }
      res.status(200).json({
        status: "ok",
        message: "Kelompok deleted",
        data: {
          document: doc,
          deletedId: id
        },
        request: {
          type: req.method,
          url: req._remoteAddress
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      });
    });
};

exports.update_anggota = (req, res, next) => {
  // console.log("BODY : ", req.body.namaKelompok)

  // console.log(jsonAnggotaKelompok)
  KelompokModel.findOneAndUpdate(
    {
      _id: req.body._id,
      "anggotaKelompok._idAnggota": req.body._idAnggota
    },
    {
      $set: {
        // TO UPDATE ALL fields use : { "anggotaKelompok.$" : req.body.anggotaKelompok }
        // req.body.anggotaKelompok must be in JSON formatted string, ex :
        //    {"ketKelompok":"TESTUPDATE",
        //       "ket_pembawa_acara":"JACK",
        //       "jamMulai":"09:30",
        //       "jamSelesai":"10:30"}
        // to update just some fields just remove unneeded field from JSON data
        //
        // TO UPDATE ALL FIELDS, notice that _id will be changed, use :
        // "anggotaKelompok.$":  JSON.parse(req.body.anggotaKelompok),

        // UPDATE INDIVIDUAL FIELDS (_id will not be changed) :
        "anggotaKelompok.$.jabatan": req.body.jabatan,
        "anggotaKelompok.$.tglJabatan": req.body.tglJabatan
      }
    },
    {
      new: true
    }
  )
    .then((doc, err) => {
      if (doc == null) {
        res.status(500).json({
          error: {
            message: "Document not found",
            _idKelompok: req.body._idKelompok,
            _idAnggota: req.body._idAnggota
          }
        });
        return;
      }

      if (err) {
        console.log("Something wrong when updating data!");
        res.status(500).json({
          status: "error",
          message: err
        });
        return;
      }

      res.status(200).json({
        status: "ok",
        message: "Anggota Kelompok updated",
        data: {
          document: doc
        },
        request: {
          type: req.method,
          url: req._remoteAddress
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      });
    });
};

exports.update_all_anggota = (req, res, next) => {
  console.log("BODY : ", req.body);
  const jsonAnggotaKelompok = JSON.parse(req.body.anggotaKelompok);

  console.log(jsonAnggotaKelompok);
  KelompokModel.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(req.params.id)
    },
    {
      $set: {
        // OVERWRITE WITH NEW COLLECTION :
        // req.body.anggotaKelompok must be in JSON formatted string, ex :
        //    [{"ketKelompok":"KEGIATAN 1",
        //       "ket_pembawa_acara":"JACK",
        //       "jamMulai":"09:30",
        //       "jamSelesai":"10:30"},
        //     {"ketKelompok":"KEGIATAN 2",
        //       "ket_pembawa_acara":"JACK",
        //       "jamMulai":"09:30",
        //       "jamSelesai":"10:30"}
        //    ]

        anggotaKelompok: jsonAnggotaKelompok
      }
    },

    // {arrayFilters: [{"anggotaKelompok._id":   req.body._idAnggota }]},
    {
      new: true
    }
  )
    .then((doc, err) => {
      if (err) {
        console.log("Something wrong when updating data!");
        res.status(500).json({
          status: "error",
          message: err
        });
        return;
      }
      if (doc == null) {
        res.status(404).json({
          status: "error",
          message: "Kelompok Not Found",
          data: {
            _idKelompok: req.body._idKelompok
          },
          request: {
            type: req.method,
            url: req._remoteAddress
          }
        });
        return;
      }
      res.status(200).json({
        message: "Anggota Kelompok updated",
        request: {
          type: req.method,
          url: req._remoteAddress,
          body: doc
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      });
    });
};

exports.delete_anggota = (req, res, next) => {
  KelompokModel.findOneAndUpdate(
    {
      _id: req.body._id
    },
    {
      $pull: {
        anggotaKelompok: {
          _idAnggota: req.body._idAnggota
        }
      }
    },
    {
      new: true
    }
  )
    .then((doc, err) => {
      if (err) {
        console.log("Something wrong when deleting data!");
        res.status(500).json({
          status: "error",
          message: err
        });
        return;
      }
      if (doc == null) {
        res.status(404).json({
          status: "error",
          message: "Anggota Kelompok Not Found",
          data: {
            _idKelompok: req.body._idKelompok,
            _idAnggota: req.body._idAnggota
          },
          request: {
            type: req.method,
            url: req._remoteAddress
          }
        });
        return;
      }

      res.status(200).json({
        status: "ok",
        message: "Anggota Kelompok deleted",
        data: {
          document: doc
        },
        request: {
          type: req.method,
          url: req._remoteAddress
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err
      });
    });
};

exports.insert_several_anggota = (req, res, next) => {
  console.log(req.body._id);
  var json = JSON.parse(req.body.anggotaKelompok);
  console.log("anggota kelompok json", json);
  console.log("--------------------------------");

  var failedDoc = [];
  var successDoc = [];

  KelompokModel.findById({
    _id: mongoose.Types.ObjectId(req.body._id)
    //_id:  req.body._id,
  })
    .then(doc => {
      console.log("after find", doc);
      if (doc == null) {
        console.log("doc is null");
        return func.resStatusErrorProcess(
          req,
          res,
          "Kelompok not found : id :" + req.body._id,
          json,
          404
        );
      }
      var insertCount = 0;
      var requestCount = json.length;
      json.forEach(elem => {
        // requestedinsertCount++

        var founddocs = doc.anggotaKelompok.filter(function(value) {
          return value._idAnggota == elem._idAnggota;
        });

        console.log(founddocs);
        if (founddocs.length == 0) {
          console.log("Insert");
          doc.anggotaKelompok.push(elem);
          successDoc.push(elem);
          insertCount++;
        } else {
          console.log("id already exist");
          elem.reason = "id already exist";

          failedDoc.push(elem);
        }
      });

      doc.save();
      if (insertCount == 0) {
        return func.resStatusErrorProcess(
          req,
          res,
          "All Requested Anggota Kelompok Not inserted",
          failedDoc
        );
      }
      if (insertCount == requestCount) {
        return func.resStatusOkUpdates(
          req,
          res,
          "All Anggota Kelompok Successfuly Inserted",
          doc,
          successDoc
        );
      } else {
        return func.resStatusOkUpdates(
          req,
          res,
          "Some Anggota Kelompok NOT inserted",
          doc,
          successDoc,
          failedDoc
        );
      }
    })
    .catch(err => {
      console.log("error", err);
      return func.resStatusErrorServer(req, res, err);
    });
};

exports.insert_one_anggota = (req, res, next) => {
  // console.log("--------------------------------")
  var requestedinsertCount = 1;
  var insertCount = 0;
  var failedDoc = [];
  KelompokModel.findById({
    _id: mongoose.Types.ObjectId(req.body._id)
  })
    .then(doc => {
      var elem = {
        _idAnggota: req.body._idAnggota,
        jabatan: req.body.jabatan,
        tglJabatan: req.body.tglJabatan
      };

      if (doc == null) {
        return func.resStatusErrorProcess(
          req,
          res,
          "Kelompok not found : id :" + req.body._id,
          elem,
          404
        );
      }

      // console.log(JSON.stringify(doc.anggotaKelompok))
      var founddocs = doc.anggotaKelompok.filter(function(value) {
        return value._idAnggota == req.body._idAnggota;
      });
      // console.log(founddocs.length)
      if (founddocs.length == 0) {
        doc.anggotaKelompok.push(elem);
        insertCount++;
      } else {
        elem = {
          ...elem,
          ...{
            reason: "Already Exists"
          }
        }; // add new key 'reason' to object
        failedDoc.push(elem);
      }

      if (insertCount == requestedinsertCount) {
        doc.save();
        return func.resStatusOkUpdates(
          req,
          res,
          "Anggota Kelompok inserted",
          doc,
          elem
        );
      } else {
        return func.resStatusErrorProcess(
          req,
          res,
          "Failed to insert Anggota Kelompok",
          elem
        );
      }
    })
    .catch(err => {
      console.log(err);
      return func.resStatusErrorServer(req, res, err);
    });
};

exports.update_non_array = (req, res, next) => {
  // if (req.body.anggotaKelompok) {
  //   req.body.anggotaKelompok = JSON.parse(req.body.anggotaKelompok)
  // }
  KelompokModel.findOneAndUpdate(
    {
      _id: req.params.id
    },
    {
      $set:
        //json
        req.body // only update fields that are in req.body list, other fields that are not specified in re.body will stay the same, WORKS ONLY WITH NON ARRAY DATA
    },
    {
      new: true
    }
  )
    .then(doc => {
      if (doc == null) {
        return func.resStatusErrorProcess(
          req,
          res,
          "Document not found : " + req.params.id,
          req.body,
          404
        );
      }

      return func.resStatusOkUpdates(
        req,
        res,
        "Update Berhasil",
        doc,
        req.body,
        null
      );
    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err);
    });
};

exports.update = (req, res, next) => {
  // console.log("anggota_update_anggota API: BODY/HEADERS/PARAMS")
  //console.log(typeof req.body.minat)
  // console.log(req.headers)

  var fotoProfilLama;
  const id = req.body._id;
  KelompokModel.findById(id)
    //.select(fields.join(' '))
    .exec()
    .then(kelompok => {
      // req.body.forEach(element => {

      // });
      if (kelompok) {
        for (var key in req.body) {
          console.log(key, " : ", req.body[key]);

          if (key == "anggotaKelompok") {
            // console.log(typeof AnggotaModel.minat)
            kelompok[key] = JSON.parse(req.body[key]);
          } else {
            kelompok[key] = req.body[key];
          }
        }

        if (req.file) {
          if (kelompok.fotoProfil) {
            fotoProfilLama = anggota.fotoProfil;
          }
          kelompok.fotoProfil = req.file.path;
          console.log(req.file.path);
        } else {
          console.log("No Foto Profil uploaded");
        }
        kelompok
          .save() // will return updatedAnggota if success
          .then(updatedData => {
            if (updatedData.fotoProfil) {
              if (fotoProfilLama) {
                var deleter = require("../globalfunctions");
                if (!deleter.deleteFile(fotoProfilLama)) {
                  console.log("Foto Lama tidak ditemukan");
                } else {
                  console.log("FotoProfil lama dihapus");
                }
              }
            }
            return func.resStatusOkUpdates(
              req,
              res,
              "Update Kelompok berhasil disimpan",
              updatedData
            );
          })
          .catch(err => {
            return func.resStatusErrorServer(req, res, err, err);
          });
      } else {
        return func.resStatusErrorProcess(
          req,
          req,
          "Anggota tidak ditemukan",
          req.body,
          404
        );
      }
    })
    .catch(err => {
      // const errMs = err.message
      console.log("Error in : update => ");
      return func.resStatusErrorServer(req, res, err, err);
    });
};

exports.select_all_anggota = (req, res, next) => {
  const startTime = process.hrtime();
  const selectoption = req.params.option == "anggota" ? "anggotaKelompok" : "";
  console.log(req.params.option);

  KelompokModel.find({
    _id: req.params._id
  })
    .select(selectoption)

    //.select("anggotaKelompok")
    .exec()
    .then((doc, err) => {
      if (doc == null) {
        return func.resStatusErrorProcess(
          req,
          res,
          "not found",
          req.params._id
        );
      }

      return func.resStatusOkGet(req, res, doc, startTime);
    })
    .catch(err => {
      return func.resStatusErrorServer(req, res, err);
    });
};
