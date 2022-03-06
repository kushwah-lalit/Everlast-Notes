const User = require('../models/user');
const Problem = require('../models/problem');
module.exports.showProblems = async function(req,res){
    try{
        let problems;
        if(req.params.platform === "all"){
            problems = await Problem.find({author:{ $ne: req.user.id }}).sort('createdAt');
        }else{
            problems = await Problem.find({author:{ $ne: req.user.id },website:req.params.platform}).sort('createdAt');
        }
        const solvedProblems = (await Problem.find({ author: req.user.id }).select('link -_id')).map((item) => { return item.link; });
        console.log(solvedProblems);
        problems = problems.filter((item) => {
            if (((item.link).includes("leetcode") || (item.link).includes("geeksforgeeks") || (item.link).includes("codechef") || (item.link).includes("codeforces") || (item.link).includes("hackerrank") || (item.link).includes("hackerearth"))&&(!solvedProblems.includes(item.link))) {
                return item;
            }
        });
        const arrayUniqueByKey = [...new Map(problems.map(item => [item["link"], item])).values()];
        console.log('data',arrayUniqueByKey);
        return res.render('practice',{
            title:'Practice',
            problems:arrayUniqueByKey
        });
    }catch(err){
        req.flash('error', err);
        console.log('Practice Page Load :: Error :',err);
        return res.redirect('back');
    }
};
module.exports.addToProblems = async function(req,res){
    try{
        let problem = await Problem.findById(req.params.id);
        // console.log(problem);
        // console.log('malik',problem.author);
        // console.log('requested',req.user);
        if(problem){
            User.findById(req.user.id,async function(err,user){
                if(err){
                    req.flash('error', err);
                    console.log('User not found to problem :: Error :',err);
                    return;
                }
                Problem.create({
                    name:problem.name,
                    description:"Enter Problem Description",
                    code:"//Enter Problem Solution Code Snippet",
                    link:problem.link,
                    lang:problem.lang,
                    topic:problem.topic,
                    website:problem.website,
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
                        return res.redirect(`/problem/update/${problem.id}`);
                    }
                });
    
            });
        }else{
            req.flash('error', err);
            console.log('Problem does not exists :: Error :',err);
            return res.redirect('back');
        }
        
    }catch(err){
        req.flash('error', err);
        console.log('Problem AddToProblems :: Error :',err);
        return res.redirect('back');
    }
};