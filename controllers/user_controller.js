const User =require('../models/user');
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
// sendgrid api key for the connection validation
sgMail.setApiKey('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');
const crypto = require('crypto');
module.exports.login = function(req,res){
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('login',{
        title:'Everlast Notes'
    });
};
module.exports.signup = function(req,res){
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('signup',{
        title:'Create Account'
    });
};
// // sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}
// signout
module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');
    return res.redirect('/users/login');
}
module.exports.create = function(req, res){
    if(req.body.password!=req.body.confirmpassword){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            // console.log('Error while finding the user');
            req.flash('error', err); 
            return;
        }
        if(!user){
            User.create({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                emailToken:crypto.randomBytes(64).toString('hex'),
                avatar:"/images/hacker.png"
            },async function(err,user){
                if(err){
                    // console.log('Error while creating the user');
                    req.flash('error', err);
                    console.log('User not created :: Error :',err);
                    return;
                }else{
                    // once inserted then trigger the sendgrid to send the mail
                    const msg = {
                        to: user.email, // Change to your recipient
                        from: 'projectmailer.tester@gmail.com', // Change to your verified sender
                        subject: 'Welcome to Everlast Notes - Verify your Account',
                        text: `Hello!! Thank You for registering on Everlast Notes.
                        Please copy and paste the address below to verify your account.
                        http://${req.headers.host}/verify-email?token=${user.emailToken}`,
                        html: `<h1>Welcome to Everlast Notes - Verify your Account</h1>
                        <h2>Hello!! Thank You for registering on Everlast Notes.</h2>
                        <h3>Please click the below link to verify your account in order to continue using website services</h3>
                        <a href="http://${req.headers.host}/users/verify-email?token=${user.emailToken}">Click Here to Verify Account</a>
                        `,
                      }
                      try{
                        await sgMail.send(msg);
                        req.flash('success','Signed Up Successfully : Verify Email ID on registered email to Sign In');
                        // mail send then bring back user to signin page
                        return res.redirect('/users/signup');
                      }catch(err){
                          console.log(`Error on mail sendig : ${err}`);
                          req.flash('error','Verification mail cannot be sent contact Admin');
                        //   else error in sending the mail then back to signup page
                          return res.redirect('users/signup');

                      }
                }
            });

        }else{
            req.flash('error','User already exists');
            // user exists then back to signup page
            return res.redirect('back');
        }
    });
}
// action to verify user from the mail
module.exports.verifyEmail = function(req,res){
    // sql query to search for the user with the email token got from the query
    User.findOne({emailToken:req.query.token},function(err,user){
        if(err){
            // console.log('Error while finding the user');
            req.flash('error', err); 
            console.log(`Error on searching user: verfiy email stage::${err}`);
            return;
        }
        if(user){
            user.emailToken = null;
            user.isVerified = true;
            user.save();
            req.flash('success','Successfully Verified');
            // back to signin page
            return res.redirect('/users/signup');
        }else{
            console.log(`Cant verify as token is invalid`);
            req.flash('error','Verified Failed');
            return res.redirect('/users/signup');
        }
    });
};
module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log('Error finding user with requested',err);
        }
        return res.render('profile', {
            title: 'Profile Page',
            profile_user: user
        });
    });
};
module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar( req, res, function(err){
                if(err){
                    console.log('Multer Error :',err);
                }
                // we wont be able to read the form details as form is multipart...so this statci helps us
                console.log(req.file);
                if(req.file){
                    if(!user.avatar.endsWith("=s720-c")){
                        fs.unlinkSync(path.join(__dirname, '..' , user.avatar));
                    }
                    // this will saving the address or path in the user avtar key
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                req.flash('success', 'Updated!');
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}
module.exports.updateName = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            if(user){
                user.name = req.body.name;
                user.save();
                req.flash('success', 'Updated!');
                return res.redirect('back');
            }else{
                req.flash('error', 'Not Updated!');
                return res.redirect('back');
            }

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}
module.exports.updatePassword = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            if(user){
                user.password = req.body.password;
                user.save();
                req.flash('success', 'Updated!');
                return res.redirect('back');
            }else{
                req.flash('error', 'Not Updated!');
                return res.redirect('back');
            }

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}
module.exports.updateGithub = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            if(user){
                user.github = req.body.github;
                user.save();
                req.flash('success', 'Updated!');
                return res.redirect('back');
            }else{
                req.flash('error', 'Not Updated!');
                return res.redirect('back');
            }

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}
module.exports.updateLinkedin = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            if(user){
                user.linkedin = req.body.linked;
                user.save();
                req.flash('success', 'Updated!');
                return res.redirect('back');
            }else{
                req.flash('error', 'Not Updated!');
                return res.redirect('back');
            }

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}
module.exports.updateFacebook = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            if(user){
                user.facebook = req.body.facebook;
                user.save();
                req.flash('success', 'Updated!');
                return res.redirect('back');
            }else{
                req.flash('error', 'Not Updated!');
                return res.redirect('back');
            }

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}
module.exports.updateInstagram = async function(req, res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            if(user){
                user.instagram = req.body.instagram;
                user.save();
                req.flash('success', 'Updated!');
                return res.redirect('back');
            }else{
                req.flash('error', 'Not Updated!');
                return res.redirect('back');
            }

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}