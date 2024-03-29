const User = require('../models/user');
const Problem = require('../models/problem');
const bellData = require('./bell_controller');
module.exports.showProblems = async function(req,res){
    try{
        let problems;
        if(req.params.platform === "all"){
            problems = await Problem.find({author:req.user.id,favourite: true}).sort('-createdAt');
        }else{
            problems = await Problem.find({author:req.user.id,favourite: true,website:req.params.platform}).sort('-createdAt');
        }
        let noty = await bellData.taskData(req.user.id);
        return res.render('favourite',{
            title:'Favourites',
            problems:problems,
            noty:noty
        });
    }catch(err){
        req.flash('error', err);
        console.log('Favourite Page Load :: Error :',err);
        return res.redirect('back');
    }
};
module.exports.toggleFavourite = async function(req,res){
    try{
        let problem = await Problem.findById(req.params.id).populate('author');
        if(problem){
            if(problem.author.id == req.user.id){
                problem.favourite = !problem.favourite;
                await problem.save();
                if (req.xhr){
                    return res.status(200).json({
                        data: {
                            problem_id: req.params.id
                        },
                        message: "Post deleted"
                    });
                }
                return res.redirect('back');
            }else{
                req.flash('error', err);
                console.log('Problem favourite access denied :: Error :',err);
                return res.redirect('back');
            }
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
