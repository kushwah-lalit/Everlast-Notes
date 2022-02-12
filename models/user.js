const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    problemCount:{
        type:Number,
        default:0
    },
    emailToken:{
        type:String,
        default:null
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    github:{
        type:String,
        default:"https://github.com/"
    },
    linkedin:{
        type:String,
        default:"https://www.linkedin.com/home"
    },
    facebook:{
        type:String,
        default:"https://www.facebook.com/"
    },
    instagram:{
        type:String,
        default:"https://www.instagram.com/"
    },
    problems:{
        type:Map,
        of:{type: Number},
        default:{
            "Recursion":0,
            "Linked List":0,
            "Stack":0,
            "Queue":0,
            "Tree":0,
            "Binary Tree":0,
            "BST":0,
            "Maps":0,
            "OOPs":0,
            "Prority Queue":0,
            "Trie":0,
            "DP":0,
            "Graph":0,
            "Backtracking":0,
            "Array":0,
            "String":0,
            "Bit Manipulation":0,
            "Pointers":0,
            "Mathematical":0,
            "Others":0
        },
        required:true
    },
    todos:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
});
// setup the destination and the filename
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });
//   static functions
userSchema.statics.uploadedAvatar = multer({storage : storage}).single('avatar');
// single to upload the single file as many can also be uploaded
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User',userSchema);
module.exports = User;