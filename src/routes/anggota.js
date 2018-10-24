const express = require("express")
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const anggotaController = require('../controllers/anggota')

// This is a HTTP POST function.
// upload.single('fotoProfil') is Multer middleware. It means we accept a single file with the field name avatar. File upload will be handled by Multer.
// Multer will add a file property for request when it's a single file upload. (ie : 'req.file' )
// Now We can use the 'req.file.path' for instance

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    //console.log(file);
    cb(null, './uploads/fotoprofil/');
  },
  filename: function(req, file, cb) {
    // use this on Windows dir
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    // otherwise (in Linux or IOS use this
    // cb(null, new Date().toISOString() + file.originalname);
    // console.log(file.path);
  }
});

const fileFilter = (req, file, cb) => {
// reject a file
var allowedMimes =['image/jpeg','image/png' , 'image/gif']
if (allowedMimes.indexOf(file.mimetype) > -1) {
  cb(null, true)
  } else {
  cb(null, false)
  }   

// if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//   cb(null, true);
// } else {
//   cb(null, false);
// }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
})


// rule of thumb in ordering router list:
// > make those more specific middlewares come before those more general ones
//   for instance : '/select_hut_yearly' is more specific than '/select_hut_by_bulan/:bulan'
// > if the order is switched than there will be error like ObjectID cast error
router.get("/select_hut_yearly", anggotaController.select_hut_yearly) 
router.get("/select_hut_by_bulan/:bulan", anggotaController.select_hut_by_bulan)
router.get("/select_all_by_nama/:namaDepan&:namaKeluarga", anggotaController.select_all_by_nama)
router.get("/:id", anggotaController.select_by_id)




 

router.post("/", checkAuth, upload.single('fotoProfil'), anggotaController.insert)

// router.patch("/update", checkAuth ,anggotaController.update)
 router.patch("/update", checkAuth, upload.single('fotoProfil'),anggotaController.update)

router.patch("/updatefotoprofil", checkAuth, upload.single('fotoProfil'),anggotaController.update_fotoprofil)


//router.post("/", checkAuth,   anggotaController.insert)

router.patch("/update_id_keluarga/", checkAuth ,anggotaController.update_id_keluarga)
router.patch("/update_dynamic_body_fields/:id", checkAuth ,anggotaController.update_dynamic_body_fields)

router.post("/delete", checkAuth, anggotaController.delete)

module.exports = router

// Example of client app posting multipart/form-data :
// const headers = {
//   'Authorization': 'Bearer ' + getters.jwt ,
//   'Content-Type': 'multipart/form-data'
//   // 'Content-Type': 'application/json; charset=utf-8'
// }
//  var formData = new FormData()
//       formData.append( 'fotoProfil', payload.fotoProfil)
//       formData.append( 'name', payload.name)
//       formData.append( 'price', payload.price)
//       formData.append( 'specification', payload.specification)
//       console.log(formData)
//       console.log(payload, payload.fotoProfil, headers)

//       Axios.post(apiUrl + '/anggota', formData, {'headers' : headers})