const mongoose = require('mongoose');

const keluargaSchema = mongoose.Schema({
 
    _id: { type: mongoose.Schema.Types.ObjectId},
    namaKeluarga: { type: String, required: true },
    
    alamat: { type: String, required: true },
    fotoProfil: { type: String, required: false }
})

 
module.exports = mongoose.model('Keluarga', keluargaSchema)