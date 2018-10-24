const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    level: {type: String, required: true, enum: ['Super User', 'Admin', 'Messenger','Admin Kelompok','Admin Anggota','User']},
     
});

module.exports = mongoose.model('UserLevels', userSchema);