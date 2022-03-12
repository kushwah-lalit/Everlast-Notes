const User = require('../models/user');
const Problem = require('../models/problem');
module.exports.showProblems = async function(req,res){
    try{
        let problems;
        if(req.params.platform === "all"){
            problems = await Problem.find({author:req.user.id,favourite: true}).sort('-createdAt');
        }else{
            problems = await Problem.find({author:req.user.id,favourite: true,website:req.params.platform}).sort('-createdAt');
        }
        return res.render('favourite',{
            title:'Favourites',
            problems:problems
        });
    }catch(err){
        req.flash('error', err);
        console.log('Favourite Page Load :: Error :',err);
        return res.redirect('back');
    }
};
module.exports.toggleFavourite = async function(req,res){
    try{
        let problem = await Problem.findById(req.params.id);
        if(problem){
            problem.favourite = !problem.favourite;
            await problem.save();
            return res.redirect('back');
        }else{
            req.flash('error', err);
            console.log('Problem does not exists :: Error :',err);
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        console.log('Problem Favourite not toggled :: Error :',err);
        return res.redirect('back');
    }
};
