const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const TipeKegiatanModel = require("../models/tipekegiatan");
const KegiatanModel = require("../models/kegiatan");
const fields = [
  "kategoriKegiatan",
  "tipeKegiatan",
]

 

exports.select_list = (req, res, next) => {
  var querySelection ="AAAA"
  
 
  // const startDate=req.params.startDate
  // const endDate=req.params.endDate

  // console.log(startDate,endDate)
 var searchParams ={}

//  searchParams ["tgl_mulai"]= {$gte: startDate}
//  searchParams ["tgl_selesai"]={$lte: endDate} 

 
 // console.log("searchParams",searchParams)
 TipeKegiatanModel.find( searchParams )
    .select(fields.join(' '))
    .sort([["kategoriKegiatan", 1]])
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
        
        }
      });
    });
}

exports.select = (req, res, next) => {
  KegiatanModel.findById(req.params.id)
    .populate("tipeKegiatan")
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



exports.select_list_sum_uang = (req, res, next) => {
  
 var searchParams ={}

//  searchParams ["tgl_mulai"]= {$gte: startDate}
//  searchParams ["tgl_selesai"]={$lte: endDate} 

TipeKegiatanModel.aggregate([
  // stage 1: join subcategories
  {
    $lookup: {
      from: "kegiatans",
      localField: "_id",
      foreignField: "_id_tipe_kegiatan",
      as: "filteredKegiatans"
    },
  },
  // at this point, each document will have an additional subcategory array with all the "joined" documents from subcategories collection
  // stage 2: we need to "unwind" the subcategory array in order to join the products
  // when you unwind an array, it's like making each element in the array have its own document
  {
      $unwind: '$filteredKegiatans'
  },
  // // stage 3: join products
  // {
  //     $lookup: {
  //         from: 'products',               // collection to join
  //         localField: 'kegiatanJoin._id',  // field from our updated collection
  //         foreignField: 'idsubcategory',  // field from products collection
  //         as: 'products'
  //     }
  // },

  // EDIT

  // stage 4: strip out all fields except _id, category name, and quantity (number of products)
  // {
  //     $project: {
       

  //          tipeKegiatan: true, 
  //         // //jumlahPerpuluhan: { $size: '$products' }
  //         // nama_kegiatan: true,
  //         // jumlahPerpuluhan: true,
  //         // jumlahPersembahan: true
  //     }
  // },
  // stage 5: group by category ID
  {
      $group: {
            _id: '$_id',                        // group by category ID
          // tipeKegiatan: { $first: '$tipeKegiatan' },  // get category name
          tipeKegiatan: { $first: '$tipeKegiatan' },  // get category name
         
          
          jumlahPerpuluhan: { $sum: '$filteredKegiatans.jumlahPerpuluhan' },    // sum the quantities
          jumlahPersembahan: { $sum: '$filteredKegiatans.jumlahPersembahan' }, 
      }
  }
])
  
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
        
        }
      });
    });
}

exports.select = (req, res, next) => {
  TipeKegiatanModel.findById(req.params.id)
    .populate("tipeKegiatan")
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
  const tipeKegiatanbaru = new TipeKegiatanModel({
    _id: new mongoose.Types.ObjectId(),
     kategoriKegiatan: req.body.kategoriKegiatan,
    tipeKegiatan: req.body.tipeKegiatan,
    
 


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

  TipeKegiatanModel.findOneAndDelete({
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


 
  TipeKegiatanModel.findOneAndUpdate({
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