const Task =require('../models/task');
module.exports.taskData = async function(id){
    let tasks = await Task.find({author:id}).sort('dueDate');
    let overdue = [];
    // console.log(tasks);
    for(let task of tasks){
        if((new Date()).getTime() > (new Date(task.dueDate)).getTime()){
            overdue.push(task);
        }else{
            break;
        }
    }
    return overdue;
};