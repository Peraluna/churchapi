const mongoose = require('mongoose');

 
const agendaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tipe_agenda:  [{ type: String, required: true }], // hari perbaktian, malam rabu. kelompok, lain-lain
    _idKelompok: { type: String, required: false, ref: kelompokpelayanan },
    tglAgenda: { type: Date, required: true },
    jamMulai: { type: TimeRanges, required: true },
    jamSelesai: { type: TimeRanges, required: true },
    status: { type: String, required: true , default: ''},
    namaPenanggungJawab: { type: String, required: true }, // 
    ketAgenda: { type: String, required: true },
    
  
});

module.exports = {
    agendaSchema: mongoose.model('agenda', agendaSchema),
}