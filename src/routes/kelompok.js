const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const KelompokController = require('../controllers/kelompok');

// Handle incoming GET requests to /orders

// POSTMAN TEST :
/* http://localhost:5000/Kelompok
   type     : GET
   HEADER   : Key : Authorization , value : Bearer webtokensentwhenlogin


*/

// router.patch("/updateanggota/:_idKelompok&:idanggota", checkAuth, KelompokController.Kelompok_update_anggota);
router.post("/", checkAuth, KelompokController.insert);
router.delete("/", checkAuth, KelompokController.delete);
router.patch("/:id", checkAuth, KelompokController.update);
router.post("/insert_several_anggota/", checkAuth, KelompokController.insert_several_anggota);
router.post("/insert_one_anggota/", checkAuth, KelompokController.insert_one_anggota);
router.post("/update_one_anggota/", checkAuth, KelompokController.update_anggota);
router.patch("/updateanggotaall/:id", checkAuth, KelompokController.update_all_anggota);
router.delete("/deleteoneanggota/", checkAuth, KelompokController.delete_anggota);


router.get("/:id",   KelompokController.select);
router.get("/",  KelompokController.select_all);
// router.get("/byidtipeKelompok/:id_tipe_Kelompok", KelompokController.Kelompok_get_all_by_idtipeKelompok)
 
router.get("/select_by_name_with_anggota/:namaKelompok", KelompokController.select_by_name_with_anggota)
router.get("/select_all_anggota/:_id&:option", KelompokController.select_all_anggota)
router.get("/select_all_by_idanggota/:_idAnggota", KelompokController.select_all_by_idanggota)


 

module.exports = router;
