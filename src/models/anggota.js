const mongoose = require('mongoose');
 


const anggotaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    noAnggota: {
        type: String,
        required: true,
        unique: true,
        required: true,
        dropDups: true
    },
    statusDalamKeluarga: {
        type: String,
        required: true ,
        enum: ['Kepala Keluarga', 'Istri', 'Anak', 'Cucu', 'Orang Tua', 'Kakek', 'Nenek', 'Keponakan', 'Saudara', 'Lain-Lain']
    },
    statusPernikahan: {
        type: String,
        required: true,
        enum: ['Lajang', 'Duda', 'Janda', 'Menikah', 'Lain-Lain']
    },
    salut: {
        type: String,
        required: false
    }, // Sdr., Pdt., PdtM., Ztr., Sdri.
    gelarDepan: {
        type: String,
        required: false
    }, // Ir., Drs, Dr., DR.
    namaDepan: {
        type: String,
        required: true
    },
    namaPanggilan: {
        type: String,
        required: false
    },
    namaKeluarga: {
        type: String,
        required: true
    },
    gelarBelakang: {
        type: String,
        required: false
    }, // Msc, Mkes.
    jenisKelamin: {
        type: String,
        required: true,
        enum: ['Laki-Laki', 'Perempuan']
    },
    alamat: {
        type: String,
        required: false
    },
    _idKeluarga: {
        // keluarga orang tua
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Keluarga'
    },
    _idKeluargaSendiri: {
        // keluarga sendiri (kalau sudah menikah)
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Keluarga'
    },
    tglBaptis: {
        type: String,
        required: false
    },
    tglLahir: {
        type: Date,
        required: true
    },
    pekerjaan: {
        type: String,
        required: false
    },
    bidangPekerjaan: {
        type: String,
        required: false
    },
    noTelpon: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    _idUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    fotoProfil: {
        type: String,
        required: false
    },
    minat: [],
    keahlian: [],

}, 
// {
//     toObject: {
//         virtuals: true
//     }
//     // toJSON: {
//     //     virtuals: true
//     // }
// }
);

// anggotaSchema.virtual("namaLengkap").get(function () {
//     return this.namaDepan + ' ' + this.namaKeluarga
// })
// anggotaSchema.virtual("namaLengkapGelar").get(function () {
//     return this.gelarDepan + ' ' + this.namaDepan + ' ' + this.namaKeluarga + ((this.gelarBelakang === '') ? '' : ', ' + this.gelarBelakang)
// })

module.exports = mongoose.model('Anggota', anggotaSchema)