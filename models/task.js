const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    } 
},
{
    timestamps:true
});
const Task =mongoose.model('Task',taskSchema);
module.exports = Task;