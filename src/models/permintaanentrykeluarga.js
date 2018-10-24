const mongoose = require('mongoose');

const perminataanEntryKeluargaSchema = mongoose.Schema({
 
    _id: { type: mongoose.Schema.Types.ObjectId},
    _userId: { type: String, required: true },
    tgl: {type: Date, required: true},
   
})

 
module.exports = mongoose.model('Keluarga', perminataanEntryKeluargaSchema)