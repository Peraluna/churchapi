const express = require("express")
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const gerejaController = require('../controllers/gereja')

// This is a HTTP POST function.
// upload.single('fotoProfil') is Multer middleware. It means we accept a single file with the field name avatar. File upload will be handled by Multer.
// Multer will add a file property for request when it's a single file upload. (ie : 'req.file' )
// Now We can use the 'req.file.path' for instance

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    //console.log(file);
    cb(null, './uploads/fotoprofilgereja/');
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

 

router.post("/delete", checkAuth, gerejaController.delete)
router.get("/:id", gerejaController.select_by_id)
router.get("/all/", gerejaController.select_all)




router.patch("/update", checkAuth, upload.single('fotoProfil'),gerejaController.update)

router.patch("/updatefotoprofil", checkAuth, upload.single('fotoProfil'),gerejaController.update_fotoprofil)

router.post("/", checkAuth, upload.single('fotoProfil'), gerejaController.insert)

 

 
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

//       Axios.post(apiUrl + '/gereja', formData, {'headers' : headers})