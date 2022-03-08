const mongoose = require('mongoose');
const codeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    lang:{
        type:String,
        required:true
    },
    author:{
        type:  mongoose.Schema.Types.ObjectId,
        ref:'User'
    } 
},
{
    timestamps:true
});
const Code =mongoose.model('Code',codeSchema);
module.exports = Code;