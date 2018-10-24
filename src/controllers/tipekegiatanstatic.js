const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const tipeKegiatan = require("../models/tipekegiatan");
const fields = [
  "kategori",
  "tipe",
]

const tipeKegiatanEnum=[{tipe:'Ibadah Sabat',kategori:'Ibadah Sabat'}, 
{tipe:'Ibadah Malam Rabu',kategori:'Ibadah Malam Rabu'}, 
{tipe:'Ibadah Kelompok',kategori:'Ibadah Kelompok'}, 
{tipe:'Ibadah Pemuda',kategori:'Ibadah Pemuda'},
{tipe:'Sekolah Sabat Cabang',kategori:'Sekolah Sabat Cabang'}, 
{tipe:'Lawatan Anggota',kategori: 'Lawatan Anggota'}, 
{tipe:'Lawatan Masyarakat',kategori:'Lawatan Masyarakat'},
{tipe:'KKR',kategori:'KKR'},
{tipe:'Baptisan',kategori:'Baptisan'}, 
{tipe:'Lain-Lain',kategori:'Lain-Lain'}]

exports.select_list = (req, res, next) => {
  const response = {
    status: "ok",
    message: "",
   
    
    data: {
      count: tipeKegiatanEnum.length,
      document: tipeKegiatanEnum,
    },
    request: {
      type: req.method,
      url: req._remoteAddress,
      time: new Date().toISOString(),
     
    }

  };

  res.status(200).json(response);
   
}

exports.select = (req, res, next) => {
  kegiatan.findById(req.params.id)
    .populate("tipe_kegiatan")
    .exec()
    .then(doc => {
      if (!doc) {
        return res.status(404).json({
          status:"error",
          message: "Tipe Kegiatan not found"
        })
      }
      res.status(200).json({
        status:"ok",
        message: "ok",
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
      res.status(500).json({
        status: "error",
        message: err
      })
    })
}
 
exports.insert = (req, res, next) => {

  // from POSTMAN must use x-www-form-urlencoded
  // key-valuepair : rincian_kegiatan [{"ket_kegiatan":"SONG SERVICE","ket_pembawa_acara":"YANI"}, {"ket_kegiatan":"Sekolah Sabat"","ket_pembawa_acara":"JOHN""}]

  console.log((req.body))
  const tipeKegiatanbaru = new tipeKegiatan({
    _id: new mongoose.Types.ObjectId(),
     kategori_kegiatan: req.body.kategori_kegiatan,
    tipe_kegiatan: req.body.tipe_kegiatan,
    
 


  })

  // console.log("BODY : ", req.body)

  tipeKegiatanbaru
    .save()
    .then(result => {
      // console.log("API RESULT : " + JSON.stringify(result))
      res.status(201).json({
        status: "ok",
        message: "Tipe Kegiatan berhasil ditambahkan",
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

  tipeKegiatan.findOneAndDelete({
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
        message: "Tipe Kegiatan deleted",
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



exports.update = (req, res, next) => {


 
  tipeKegiatan.findOneAndUpdate({
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
        message: "Tipe Kegiatan updated",
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