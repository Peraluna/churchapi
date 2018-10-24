const mongoose = require('mongoose');

const  tipeKegiatanSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tipeKegiatan: { type: String, required: true, enum: ['Ibadah Sabat', 'Ibadah Malam Rabu', 'Ibadah Kelompok', 'Ibadah Pemuda','Sekolah Sabat Cabang', 'Lawatan Anggota', 'Lawatan Masyarakat','KKR','Baptisan', 'Lain-Lain']},
    kategoriKegiatan: { type: String, required: true, }, // 
    
   

});

module.exports = mongoose.model('TipeKegiatan',  tipeKegiatanSchema);