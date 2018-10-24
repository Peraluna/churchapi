const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const  tipeKegiatanController = require('../controllers/tipekegiatan');
 
// Handle incoming GET requests to /orders

// POSTMAN TEST :
/* http://localhost:5000/Kegiatan
   type     : GET
   HEADER   : Key : Authorization , value : Bearer webtokensentwhenlogin


*/

// router.patch("/updaterincian/:idkegiatan&:idrincian", checkAuth,  tipeKegiatanController.kegiatan_update_rincian);
router.get("/uang/",    tipeKegiatanController.select_list_sum_uang);


router.get("/:id",    tipeKegiatanController.select);
router.get("/",    tipeKegiatanController.select_list);

router.post("/", checkAuth,  tipeKegiatanController.insert);
router.patch("/:id", checkAuth,  tipeKegiatanController.update);
router.delete("/", checkAuth,  tipeKegiatanController.delete);

module.exports = router;
