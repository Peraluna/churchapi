const mongoose = require('mongoose');
 
const beritaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    target_berita:  [{ type: String, required: true }], // umum, anggota, kelompok, 
    id_kelompok: { type: String, required: false, ref: kelompokpelayanan },
    tgl_posting: { type: Date, required: true },
    id_user_posting: { type: String, required: true, ref: User }, // 
   
    tag: [{ type: String, required: true }],
    fotoFoto: [{ type: String, required: false }]
});

module.exports = {
    Berita: mongoose.model('berita', beritaSchema),
}