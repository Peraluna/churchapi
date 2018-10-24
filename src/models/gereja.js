const mongoose = require('mongoose');

 
const gerejaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   
    namaGereja : { type: String, required: true ,
   
    alamat: { type: String, required: true },
   
    noTelpon: { type: String, required: false  },
    namaPendetaPamong: { type: String, required: false  },
    namaPendetaMuda: { type: String, required: false  },    
    fotoProfil: { type: String, required: true },

}, 
    // toJSON: {
    //     virtuals: true
    // }
});
 

module.exports = mongoose.model('Gereja', gerejaSchema)