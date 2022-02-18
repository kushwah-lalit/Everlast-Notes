const User =require('../models/user');
const Problem =require('../models/problem');
module.exports.searchProblems = async function(req,res){
    let payload = req.body.payload.trim();
    // console.log(payload);
    // in regex ^ will restrict to string starting with payload
    let searchResult = await Problem.find({name:{$regex: new RegExp('.*'+payload+'.*','i')},author:req.user}).exec();
    res.send({payload:searchResult});
};