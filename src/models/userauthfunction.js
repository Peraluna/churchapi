 const mongoose = require('mongoose');
 
 
  
 // const  tipeKegiatanSchema = require('mongoose').model('TipeKegiatan');

 

 const userAuthPermissionSchema = mongoose.Schema({

     _id:false,
    _idUser: {
       type: String,
       required: true
   },
    _idFunction: {
        type: String,
        required: true
    },
    canRead: {
        type: Boolean,
        required: true
    },
    canAdd: {
        type: Boolean,
        required: true
    },
    canDelete: {
        type: Boolean,
        required: true
    },
    canUpdate: {
        type: Boolean,
        required: true
    },
    canSendNotification: {
        type: Boolean,
        required: true
    },

   
})
 

 module.exports = mongoose.model('UserAuthPermission', userAuthPermissionSchema)