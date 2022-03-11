const User =require('../models/user');
const Task =require('../models/task');
module.exports.taskPage = async function(req,res){
    try{
        let tasks = await Task.find({author:req.user.id}).sort('dueDate');
        return res.render('tasklist',{
            title:'Task Todo',
            tasks:tasks
        });
    }catch(err){
        req.flash('error', err);
        console.log('Tasks Page Render :: Error :',err);
        return res.redirect('back');
    }
};

module.exports.deleteTask = function(req,res){
  
    Task.findById(req.params.id).populate('author').exec(async function(err,task){
        if(err){
            req.flash('error', err);
            console.log(' Error at deletion of task :: Error :',err);
            return;
        }
        if(!task) {
            req.flash('error', err);
            console.log('No Such task found :: Error :',err);
            return;
        }
        if(task.author.id == req.user.id){
            let user = await User.findById(req.user.id);
            user.todos--;
            await user.save();
            await task.remove();
            console.log('Task Deleted Successfully');
            return res.redirect('back');
        }else{
            req.flash('error', err);
            console.log('Task Deletion not authorised:: Error :',err);
            return res.redirect('back');            
        }
    });
};
module.exports.createTask = function(req,res){
  
    try{
        User.findById(req.user.id,async function(err,user){
            if(err){
                req.flash('error', err);
                console.log('User not found to task :: Error :',err);
                return;
            }
            Task.create({
                name:req.body.name,
                description:req.body.description,
                dueDate:req.body.dueDate,
                author:user
            },async function(err,task){
                if(err){
                    // console.log('Error while creating the user');
                    req.flash('error', err);
                    console.log('Task not created :: Error :',err);
                    return;
                }else{
                    req.flash('success','Task Successfully Added');
                    console.log('Task Successfully Added: ',task);
                    await user.todos++;
                    await user.save();
                    return res.redirect('back');
                }
            });

        });
    }catch(err){
        req.flash('error', err);
        console.log('Task not created :: Error :',err);
        return res.redirect('back');
    }
};
module.exports.deleteSelectedTasks = function(req,res){
    User.findById(req.user.id,function(err,user){
        if(err){
            req.flash('error', err);
            console.log('User not found to task :: Error :',err);
            return;
        }
        const ids = req.body.task;
        // if single task is to be deleted
        if (typeof(ids) == "string") {
            // finding the object via id form the request and deleting it
            user.todos--;
            Task.findByIdAndDelete(ids, function(err) {
                if (err) { 
                    console.log("error in deleting"); 
                    return; 
                }
            });
        } else {    // if multiple task is to be deleted
            user.todos = user.todos - ids.length;
            for (let id of ids) {
                // finding the object fro each id from ids list...form the request and deleting it
                Task.findByIdAndDelete(id, function (err) {
                    if (err) { 
                        console.log("error in deleting");
                        return; 
                    }
                });
            }
        }
        req.flash('success','Tasks Successfully Deleted');
        console.log('Tasks Successfully Deleted: ');
        user.save();
        return res.redirect('back');

    });
};
