const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    link:{
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
    topic:{
        type:String,
        required:true
    },
    website:{
        type:String,
        required:true
    },
    author:{
        type:  mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    favourite:{
       type:Boolean,
       default:false 
    } 
},
{
    timestamps:true
});
const Problem =mongoose.model('Problem',postSchema);
module.exports = Problem;