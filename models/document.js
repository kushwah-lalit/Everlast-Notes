const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const DOCUMENT_PATH = path.join('/uploads/users/documents');
const documentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    uploadWay:{
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    downloadLink:{
        type:String,
        required:true
    } 
},
{
    timestamps:true
});
// setup the destination and the filename
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',DOCUMENT_PATH));
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
  });
//   static functions
documentSchema.statics.uploadedDocument = multer({storage : storage, limits:{ fileSize: 1000000 * 20 },}).single('doc');
// single to upload the single file as many can also be uploaded
documentSchema.statics.documentPath = DOCUMENT_PATH;

const Document = mongoose.model('Document',documentSchema);
module.exports = Document;