const mongoose = require('mongoose');

 
const strukturOrgSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    urutan: { type: Number, required: true },
    namaJabatan:  [{ type: String, required: true }], // 
    tglPelantikan: { type: Date, required: true },
    _idAnggota: { type: String, required: true }, // 
    bidang: { type: String, required: true },
    keterangan: { type: String, required: true },
   
});

module.exports = {
  strukturOrgSchema: mongoose.model('StrukturOrg', strukturOrgSchema),
}