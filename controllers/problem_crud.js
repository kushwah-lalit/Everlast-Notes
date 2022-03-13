const User =require('../models/user');
const Problem =require('../models/problem');
const bellData = require('./bell_controller');
module.exports.problemPage = async function(req,res){
    try{
        let problems = await Problem.find({author:req.user.id}).sort('-createdAt');
        let noty = await bellData.taskData(req.user.id);
        return res.render('problems',{
            title:'Problems',
            problems:problems,
            noty:noty
        });
    }catch(err){
        req.flash('error', err);
        console.log('Problem not fetched :: Error :',err);
        return res.redirect('back');
    }
};
module.exports.addProblem = async function(req, res){
    try{
        // const code = await req.body.code.replace('<','&lt;').replace('>','&gt;');
        User.findById(req.user.id,async function(err,user){
            if(err){
                req.flash('error', err);
                console.log('User not found to problem :: Error :',err);
                return;
            }
            Problem.create({
                name:req.body.name,
                description:req.body.description,
                code:req.body.code,
                link:req.body.link,
                lang:req.body.lang,
                topic:req.body.topic,
                website:req.body.website,
                author:user
            },async function(err,problem){
                if(err){
                    // console.log('Error while creating the user');
                    req.flash('error', err);
                    console.log('Problem not created :: Error :',err);
                    return;
                }else{
                    req.flash('success','Problem Successfully Added');
                    console.log('Problem Successfully Added: ',problem);
                    const val= await user.problems.get(problem.topic);
                    await user.problemCount++;
                    await user.problems.set(problem.topic,val+1);
                    await user.save();
                    return res.redirect('back');
                }
            });

        });
    }catch(err){
        req.flash('error', err);
        console.log('Problem not created :: Error :',err);
        return res.redirect('back');
    }
}
module.exports.viewProblem = async function(req, res){
    try{
        let problem = await Problem.findById(req.params.id).populate('author');
        // console.log(problem);
        // console.log('malik',problem.author);
        // console.log('requested',req.user);
        let noty = await bellData.taskData(req.user.id);
        if(problem){
            if(problem.author.id == req.user.id){
                return res.render('problemView',{
                    title:problem.name,
                    problem:problem,
                    noty:noty
                });
            }else{
                req.flash('error', err);
                console.log('Problem access denied :: Error :',err);
                return res.redirect('back');
            }
        }else{
            req.flash('error', err);
            console.log('Problem does not exists :: Error :',err);
            return res.redirect('back');
        }
        
    }catch(err){
        req.flash('error', err);
        console.log('Problem view :: Error :',err);
        return res.redirect('back');
    }
}
module.exports.deleteProblem = async function(req, res){
    try{
        let problem = await Problem.findById(req.params.id).populate('author');
        // console.log(problem);
        // console.log('malik',problem.author);
        // console.log('requested',req.user);
        if(problem){
            if(problem.author.id == req.user.id){
                User.findById(req.user.id,async function(err,user){
                    if(err){
                        req.flash('error', err);
                        console.log('User not found to problem :: Error :',err);
                        return; 
                    }
                    const val= await user.problems.get(problem.topic);
                    await user.problemCount--;
                    await user.problems.set(problem.topic,val-1);
                    await user.save();
                    await problem.remove();
                    req.flash('success','Problem deleted successfully');
                    console.log('Problem deleted successfully');
                    return res.redirect('/problem');
                });
            }else{
                req.flash('error', err);
                console.log('Problem delete access denied :: Error :',err);
                return res.redirect('back');
            }
        }else{
            req.flash('error', err);
            console.log('Problem does not exists :: Error :',err);
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        console.log('Problem delete :: Error :',err);
        return res.redirect('back');
    }
}
module.exports.updateProblem = async function(req, res){
    try{
        let problem = await Problem.findById(req.params.id).populate('author');
        // console.log(problem);
        // console.log('malik',problem.author);
        // console.log('requested',req.user);
        let noty = await bellData.taskData(req.user.id);
        if(problem){
            if(problem.author.id == req.user.id){
                return res.render('problemUpdate',{
                    title:problem.name,
                    problem:problem,
                    noty:noty
                });
            }else{
                req.flash('error', err);
                console.log('Problem updatePage access denied :: Error :',err);
                return res.redirect('back');
            }
        }else{
            req.flash('error', err);
            console.log('Problem does not exists :: Error :',err);
            return res.redirect('back');
        }
        
    }catch(err){
        req.flash('error', err);
        console.log('Problem updatePage :: Error :',err);
        return res.redirect('back');
    }
}
module.exports.saveChangesProblem = async function(req, res){
    try{
        let problem = await Problem.findById(req.params.id).populate('author');
        // console.log(problem);
        // console.log('malik',problem.author);
        // console.log('requested',req.user);
        if(problem){
            if(problem.author.id == req.user.id){
                User.findById(req.user.id,async function(err,user){
                    if(err){
                        req.flash('error', err);
                        console.log('User not found to problem :: Error :',err);
                        return; 
                    }
                    const val= await user.problems.get(problem.topic);
                    // await user.problemCount--;
                    await user.problems.set(problem.topic,val-1);
                    // await user.save();
                    problem.name = req.body.name;
                    problem.description = req.body.description;
                    problem.link = req.body.link;
                    problem.code = req.body.code;
                    problem.topic = req.body.topic;
                    problem.lang = req.body.lang;
                    problem.website = req.body.website;
                    await problem.save();
                    const newVal = await user.problems.get(problem.topic);
                    await user.problems.set(problem.topic,newVal+1);
                    await user.save();
                    req.flash('success','Problem updated successfully');
                    console.log('Problem updated successfully');
                    return res.redirect('/problem');
                });
            }else{
                req.flash('error', err);
                console.log('Problem update changes access denied :: Error :',err);
                return res.redirect('back');
            }
        }else{
            req.flash('error', err);
            console.log('Problem does not exists :: Error :',err);
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        console.log('Problem not updated :: Error :',err);
        return res.redirect('back');
    }
}