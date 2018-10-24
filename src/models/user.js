const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    lastLoginDate: {
        type: Date,
        default: Date.now
    }, // must 'unset'  to auto update
    loginCount: {
        type : Number,
        default: 0,
    },
    userLevel: {
        type: String,
        required: true
    },
    mottoStatus: {
        type: String,
        required: false
    },
    fotoProfil: {
        type: String,
        required: false
    },
    _idAnggota : {
        type: String,
        required: false
    },
    phoneNumbers : [{
        type: String,
         
    }],
   

}, {
    timestamps: true // will add CreatedAt and UpdatedAt field, auto fill
});

module.exports = mongoose.model('User', userSchema);