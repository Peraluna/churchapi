const express = require("express")
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const keluargaController = require('../controllers/keluarga')
 
 
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    //console.log(file);
    cb(null, './uploads/fotoprofilkeluarga/');
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

router.post("/", checkAuth, keluargaController.insert)
router.delete("/", checkAuth, keluargaController.delete)
router.get("/:id", keluargaController.select)
router.get("/select_all_by_nama/:namaKeluarga", keluargaController.select_all_by_nama)
router.get("/select_with_anggota/:id", keluargaController.select_with_anggota)
router.get("/select_by_name_with_anggota/:namaKeluarga", keluargaController.select_by_name_with_anggota)
router.get("/get_image/:imageName", keluargaController.get_image)

router.patch("/update_fotoprofil/:id", checkAuth, upload.single('fotoProfil'), keluargaController.update_fotoprofil)
 

router.patch("/", checkAuth ,keluargaController.update)

 
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

//       Axios.post(apiUrl + '/keluarga', formData, {'headers' : headers})