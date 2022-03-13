const User =require('../models/user');
const Problem =require('../models/problem');
const Document =require('../models/document');
const Code =require('../models/code');
const Task =require('../models/task');

// in regex ^ will restrict to string starting with payload
module.exports.searchProblems = async function(req,res){
    let payload = req.body.payload.trim();
    let searchResult = await Problem.find({name:{$regex: new RegExp('.*'+payload+'.*','i')},author:req.user}).exec();
    res.send({payload:searchResult});
};
module.exports.searchDocuments = async function(req,res){
    let payload = req.body.payload.trim();
    let searchResult = await Document.find({name:{$regex: new RegExp('.*'+payload+'.*','i')},author:req.user}).exec();
    res.send({payload:searchResult});
};
module.exports.searchCodes = async function(req,res){
    let payload = req.body.payload.trim();
    let searchResult = await Code.find({name:{$regex: new RegExp('.*'+payload+'.*','i')},author:req.user}).exec();
    res.send({payload:searchResult});
};
module.exports.searchTasks = async function(req,res){
    let payload = req.body.payload.trim();
    let searchResult = await Task.find({name:{$regex: new RegExp('.*'+payload+'.*','i')},author:req.user}).exec();
    res.send({payload:searchResult});
};