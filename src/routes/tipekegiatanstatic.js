const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const  tipeKegiatanStaticController = require('../controllers/tipekegiatanstatic');
 
// Handle incoming GET requests to /orders

// POSTMAN TEST :
/* http://localhost:5000/Kegiatan
   type     : GET
   HEADER   : Key : Authorization , value : Bearer webtokensentwhenlogin


*/

// router.patch("/updaterincian/:idkegiatan&:idrincian", checkAuth,  tipeKegiatanController.kegiatan_update_rincian);

router.get("/",    tipeKegiatanStaticController.select_list);
router.get("/:id",    tipeKegiatanStaticController.select);

router.post("/", checkAuth,  tipeKegiatanStaticController.insert);
router.patch("/:id", checkAuth,  tipeKegiatanStaticController.update);
router.delete("/", checkAuth,  tipeKegiatanStaticController.delete);

module.exports = router;
