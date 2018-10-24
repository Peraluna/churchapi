const mongoose = require('mongoose');

const anggotaKelompokSchema = mongoose.Schema({
    _id: false,
    _idAnggota: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anggota',
        required: true,
        alias: 'rincianAnggota'
    },
    jabatan: {
        type: String,
        default: "Anggota",
        enum: ['Ketua', 'Wakil', 'Sekertaris', 'Bendahara', 'Anggota']
    },
    tglJabatan: {
        type: Date,
        required: false
    }
})
const kelompokSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    namaKelompok: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    },
    tujuanKelompok: {
        type: String,
        required: false
    },
    ketKelompok: {
        type: String,
        required: true
    },
    jenisKelompok: {
        type: String,
        default: "Lain-Lain",
        enum: [ 'Ibadah Kelompok',
        'Ibadah Pemuda',
        'Pelayanan Anggota',
        'Sekolah Sabat Cabang',
        'Ketua Gereja',
        'Pendeta Gereja',
        'Pemuda',
        'Koor',
        'Diakones',
        'Diakon',
        'Kostor',
        'Lain-Lain']
    },
    idPemimpinKelompok: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anggota',
        required: true
    },
    tglDibentuk: {
        type: Date,
        required: false
    },
    fotoProfil: {
        type: String,
        required: false
    },
    anggotaKelompok: [anggotaKelompokSchema],

});

module.exports = mongoose.model('Kelompok', kelompokSchema);