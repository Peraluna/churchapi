const mongoose = require('mongoose');

 
const organisasiDatabaseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   
    namaOrganisasi : { type: String, required: true ,
   
    
    namaDatabase: { type: String, required: false  },
   
}, 
    // toJSON: {
    //     virtuals: true
    // }
});
 

module.exports = mongoose.model('OrganisasiDatabase', organisasiDatabaseSchema)