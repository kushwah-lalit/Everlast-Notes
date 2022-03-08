const User =require('../models/user');
const Code =require('../models/code');
module.exports.codePage = async function(req,res){
    try{
        let Codes = await Code.find({author:req.user.id}).sort('-createdAt');
        return res.render('codes',{
            title:'Code Snippets',
            codes:Codes
        });
    }catch(err){
        req.flash('error', err);
        console.log('Code page not fetched :: Error :',err);
        return res.redirect('back');
    }
};
module.exports.addCode = async function(req, res){
    try{
        // const code = await req.body.code.replace('<','&lt;').replace('>','&gt;');
        Code.create({
            name:req.body.name,
            description:req.body.description,
            code:req.body.code,
            lang:req.body.lang,
            author:req.user
        },async function(err,code){
            if(err){
                // console.log('Error while creating the user');
                req.flash('error', err);
                console.log('Code not created :: Error :',err);
                return;
            }else{
                req.flash('success','Code Successfully Added');
                console.log('Code Successfully Added: ',code);
                return res.redirect('back');
            }
        });
    }catch(err){
        req.flash('error', err);
        console.log('Code not created :: Error :',err);
        return res.redirect('back');
    }
}
module.exports.viewCode = async function(req, res){
    try{
        let code = await Code.findById(req.params.id).populate('author');
        if(code){
            if(code.author.id == req.user.id){
                return res.render('codeView',{
                    title:'Code: ' + code.name,
                    code:code
                });
            }else{
                req.flash('error', err);
                console.log('Code access denied :: Error :',err);
                return res.redirect('back');
            }
        }else{
            req.flash('error', err);
            console.log('Code does not exists :: Error :',err);
            return res.redirect('back');
        }
        
    }catch(err){
        req.flash('error', err);
        console.log('Code view :: Error :',err);
        return res.redirect('back');
    }
}
module.exports.deleteCode = async function(req, res){
    try{
        let code = await Code.findById(req.params.id).populate('author');
        if(code){
            if(code.author.id == req.user.id){
                await code.remove();
                req.flash('success','Code deleted successfully');
                console.log('Code deleted successfully');
                return res.redirect('/code');
            }else{
                req.flash('error', err);
                console.log('Code delete access denied :: Error :',err);
                return res.redirect('back');
            }
        }else{
            req.flash('error', err);
            console.log('Code does not exists :: Error :',err);
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        console.log('Code delete :: Error :',err);
        return res.redirect('back');
    }
}
module.exports.updateCode = async function(req, res){
    try{
        let code = await Code.findById(req.params.id).populate('author');
        if(code){
            if(code.author.id == req.user.id){
                return res.render('codeUpdate',{
                    title:'Code: ' + code.name,
                    code:code
                });
            }else{
                req.flash('error', err);
                console.log('Problem updatePage access denied :: Error :',err);
                return res.redirect('back');
            }
        }else{
            req.flash('error', err);
            console.log('Code does not exists :: Error :',err);
            return res.redirect('back');
        }
        
    }catch(err){
        req.flash('error', err);
        console.log('Code updatePage :: Error :',err);
        return res.redirect('back');
    }
}
module.exports.saveChangesCode = async function(req, res){
    try{
        let code = await Code.findById(req.params.id).populate('author');
        if(code){
            if(code.author.id == req.user.id){
                code.name = req.body.name;
                code.description = req.body.description;
                code.code = req.body.code;
                code.lang = req.body.lang;
                await code.save();
                req.flash('success','Code updated successfully');
                console.log('Code updated successfully');
                return res.redirect('/code');
            }else{
                req.flash('error', err);
                console.log('Code update changes access denied :: Error :',err);
                return res.redirect('back');
            }
        }else{
            req.flash('error', err);
            console.log('Code does not exists :: Error :',err);
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        console.log('Code not updated :: Error :',err);
        return res.redirect('back');
    }
}