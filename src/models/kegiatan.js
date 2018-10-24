 const mongoose = require('mongoose');
 
 
  
 // const  tipeKegiatanSchema = require('mongoose').model('TipeKegiatan');


 const rincianKegiatanSchema = mongoose.Schema({

     //  _id: {
     //      type: Number
     //  },
     tglKegiatan: {
        type: String,
        required: false
    },
     jamMulai: {
         type: String,
         required: false
     },
     jamSelesai: {
         type: String,
         required: false
     },
     ketKegiatan: {
         type: String,
         required: false
     },
     // id_pembawa_acara: { type: String, required: false, ref: AnggotaSchema},
     ketPembawaAcara: {
         type: String,
         required: false
     }
 })


 const anggotaPengurusSchema = mongoose.Schema({

     _id:false,
    _idAnggota: {
       type: mongoose.Schema.Types.ObjectId,
       required: true
   },
    namaAnggota: {
        type: String,
        required: true
    },
    jabatan: {
        type: String,
        required: true
    },
    tglKonfirmasi: {
        type: Date,
        required: false
    },
    tglDaftar: {type: Date},
    hadir: {type: Boolean},
    tglHadir: {type: Date},
   
})
const anggotaSchema = mongoose.Schema({

    //  _id: {
    //      type: Number
    //  },
    _id: false,
    _idAnggota: {
       type: mongoose.Schema.Types.ObjectId,
       required: true
   },
   tglDaftar: {type: Date},
   hadir: {type: Boolean},
   tglHadir: {type: Date},
   
})
 const kegiatanSchema = mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,
     namaKegiatan: {
         type: String,
         required: false
     },
     //product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
     _idTipeKegiatan:  {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'TipeKegiatan'
         // enum: ['Ibadah Sabat', 'Ibadah Malam Rabu', 'Ibadah Kelompok', 'Ibadah Pemuda','Sekolah Sabat Cabang', 'Lawatan Anggota', 'Lawatan Masyarakat','KKR','Baptisan', 'Lain-Lain']
     } , // hari perbaktian, malam rabu. kelompok, lain-lain
     // _idKelompok: { type: String, required: false, ref: kelompokpelayanan },
     tglMulai: {
         type: Date,
         required: false
     },
     tglSelesai: {
         type: Date,
         required: false
     },
     sudahSelesai: {
         type: Boolean,
         required: true,
         default: false
     },
     namaPenanggungJawab: {
         type: String,
         required: false
     }, // 
     namaPembicara: {
        type: String,
        required: false
    }, // 
     ketKegiatan: {
         type: String,
         required: false
     },
     ketKegiatanPendek: {
        type: String,
        required: false
    },
     lokasi: {
         type: String,
         required: false
     }, // gereja, alamat rumah, alamat kunjungan

     jumlahPersembahan: {
         type: Number,
         required: false
     },
     jumlahPerpuluhan: {
         type: Number,
         required: false
     },
     jumlahSumbangan: {
         type: Number,
         required: false
     },
     jumlahPengeluaran: {
         type: Number,
         required: false
     },
     anggotaPengurus : [anggotaPengurusSchema],
     anggotaTerdaftar : [anggotaSchema],
     _idKelompokPengurus :  {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'KelompokPelayanan'},
     rincianKegiatan: [rincianKegiatanSchema],
     fotoFoto: [{
        type: String ,required: false
     }],
     youtubeTrailers: [{
        type: String ,required: false
     }]
 });

 module.exports = mongoose.model('Kegiatan', kegiatanSchema)