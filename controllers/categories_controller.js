const User =require('../models/user');
const Problem =require('../models/problem');
const bellData = require('./bell_controller');
module.exports.showProblems = async function(req,res){
    try{
        const cat = await req.params.topic.replace('+',' ');
        console.log(cat);
        let problems = await Problem.find({author:req.user.id,topic:cat}).sort('-createdAt');
        let noty = await bellData.taskData(req.user.id);
        return res.render('categories',{
            title:cat,
            problems:problems,
            noty:noty
        });
    }catch(err){
        req.flash('error', err);
        console.log('Problem view :: Error :',err);
        return res.redirect('back');
    }
};