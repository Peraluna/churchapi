const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const KegiatanController = require('../controllers/kegiatan');

// Handle incoming GET requests to /orders

// POSTMAN TEST :
/* http://localhost:5000/Kegiatan
   type     : GET
   HEADER   : Key : Authorization , value : Bearer webtokensentwhenlogin


*/

// router.patch("/updaterincian/:idkegiatan&:idrincian", checkAuth, KegiatanController.kegiatan_update_rincian);
router.post("/", checkAuth, KegiatanController.insert);
router.delete("/", checkAuth, KegiatanController.delete);
router.patch("/:id", checkAuth, KegiatanController.update);

router.patch("/updaterincian/", checkAuth, KegiatanController.update_rincian);
router.patch("/updaterincianall/:id", checkAuth, KegiatanController.update_all_rincian);
router.delete("/deleteonerincian/", checkAuth, KegiatanController.delete_rincian);


router.get("/:id",   KegiatanController.select);
router.get("/all/:startDate&:endDate",  KegiatanController.select_all_by_dates);
// router.get("/byidtipekegiatan/:id_tipe_kegiatan", KegiatanController.kegiatan_get_all_by_idtipekegiatan)
 

router.get("/byidtipekegiatanlookup/:id_tipe_kegiatan", KegiatanController.select_all_by_idtipekegiatan)

router.get("/rincian/:id", KegiatanController.select_all_rincian)
router.get("/select_by_bulan_tgl_mulai/:tahun&:bulan", KegiatanController.select_by_bulan_tgl_mulai)


 
// use params in url string :
//router.delete("/kegiatan/", checkAuth, KegiatanController.delete_kegiatan);

// use params in body (json):


 


module.exports = router;
