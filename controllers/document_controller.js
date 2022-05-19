require('dotenv').config();
const User =require('../models/user');
const Document =require('../models/document');
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
// sendgrid api key for the connection validation
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const bellData = require('./bell_controller');
module.exports.documentPage = async function(req,res){
    try{
        let documents = await Document.find({author:req.user.id}).sort('-createdAt');
        let noty = await bellData.taskData(req.user.id);
        return res.render('documents',{
            title:'Documents',
            docs:documents,
            noty:noty
        });
    }catch(err){
        req.flash('error', err);
        console.log('Documents Page Render :: Error :',err);
        return res.redirect('back');
    }
};
module.exports.uploadDoc = async function(req,res){
    try{
        let FileLink;
        User.findById(req.user.id,async function(err,user){
            if(err){
                req.flash('error', err);
                console.log('User not found to Doc :: Error :',err);
                return;
            }
            await Document.uploadedDocument( req, res,function(err){
                if(err){
                    console.log('Multer Error :',err);
                    return;
                }
                let OriginalName = req.body.name;
                if(req.file){
                    FileLink = '.' + Document.documentPath + '/' + req.file.filename;
                    console.log(FileLink);
                    OriginalName += ' [ ' + req.file.originalname + ' ] ';
                }else{
                    FileLink = req.body.doc;
                }
                Document.create({
                    name: OriginalName,
                    author: user,
                    uploadWay: req.body.uploadmethod,
                    downloadLink: FileLink,
                }, function (err, doc) {
                    if (err) {
                        // console.log('Error while creating the user');
                        req.flash('error', err);
                        console.log('Document not created :: Error :', err);
                        return;
                    } else {
                        req.flash('success', 'Document Successfully Added');
                        console.log('Document Successfully Added');
                        return res.redirect('back');
                    }
                });

            });
        });
    }catch(err){
        req.flash('error', err);
        console.log('Doc not uploaded :: Error :',err);
        return res.redirect('back');
    }
};
module.exports.downloadDoc = function(req,res){
    Document.findById(req.params.id, async function(err,file){
        let noty = await bellData.taskData(req.user.id);
        if(err || !file){
            return res.render('404', {
                title: '404 Page not found',
                noty:noty
            });
        }
        console.log(path.join(__dirname, '..' , file.downloadLink.substr(1)));
        if(file.uploadWay === "Google Drive Link"){
            res.download(file.downloadLink);
        }else{
            if(fs.existsSync(path.join(__dirname, '..' , file.downloadLink.substr(1)))){
                console.log('File Found');
                res.download(file.downloadLink);
            }else{
                console.log('File Not Found');
                return res.render('404', {
                    title: '404 Page not found',
                    noty:noty
                });
            } 
        }
    });
};
module.exports.deleteDoc = function(req,res){
  
    Document.findById(req.params.id).populate('author').exec(async function(err,file){
        let noty = await bellData.taskData(req.user.id);
        if(err || !file){
            req.flash('error', err);
            console.log('No Such Doc found :: Error :',err);
            return res.render('404', {
                title: '404 Page not found',
                noty:noty
            });
        }
        if(file.author.id == req.user.id){
            if(file.uploadWay === "Google Drive Link"){
                await file.remove();
            }else{
                if(fs.existsSync(path.join(__dirname, '..' , file.downloadLink.substr(1)))){
                    console.log('File Found');
                    fs.unlinkSync(path.join(__dirname, '..' ,file.downloadLink.substr(1)));
                }
                await file.remove();
            }
            console.log('Doc Deleted Successfully');
            return res.redirect('back');
        }else{
            req.flash('error', err);
            console.log('Doc Deletion not authorised:: Error :',err);
            return res.redirect('back');            
        }
    });
};
module.exports.shareDoc = function(req,res){
    Document.findById(req.body.fileId).populate('author').exec(async function(err,file){
            if(!file) {
                req.flash('error', err);
                console.log('No Such Doc found :: Error :',err);
                return;
            }
            if(file.author.id == req.body.userId){
                if(file.uploadWay === "Google Drive Link"){
                    var msg = {
                        to: req.body.mail,
                        from: {
                            email:process.env.SENDGRID_EMAIL,
                            name:'Everlast Notes'},
                        templateId: process.env.DRIVE_LINK_TEMPLATE,
                        dynamic_template_data: {
                        name:file.author.name,
                        fileLink:file.downloadLink
                        }
                    }
                }else{
                    var msg = {
                        to: req.body.mail,
                        from: {
                            email:process.env.SENDGRID_EMAIL,
                            name:'Everlast Notes'},
                        templateId: process.env.FILE_LINK_TEMPLATE,
                        dynamic_template_data: {
                        name:file.author.name,
                        host:req.headers.host,
                        fileId:req.body.fileId
                        }
                    }
                }
                
                try{
                    await sgMail.send(msg);
                    if (req.xhr){
                        return res.status(200).json({
                            message:`File Shared with ${req.body.mail}`
                        });
                    }
                    req.flash('success','Shared Successfully');
                    console.log('File Sent Successfully');
                    return res.redirect('back');
                }catch(err){
                    req.flash('error',err);
                    console.log(`Error on mail sendig : ${err}`);
                    return res.redirect('back');
                }
            }else{
                req.flash('error', err);
                console.log('Doc sharing not authorised:: Error :',err);
                return res.redirect('back');            
            }
    });
};