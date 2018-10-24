const express = require("express");
const router = express.Router();
const multer = require('multer')
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    //console.log(file);
    cb(null, './uploads/fotoprofiluser/');
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
// TO TEST POST USE POSTMAN
// http://localhost:5000/user/signup
router.post("/signup", UserController.user_signup);

router.patch("/updatefotoprofil/",checkAuth,upload.single('fotoProfil'), UserController.update_fotoprofil);

// http://localhost:5000/user/login
router.get("/login/:email&:password", UserController.user_login);

// http://localhost:5000/user/{id}
router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
