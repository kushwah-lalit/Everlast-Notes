require('dotenv').config();
const User =require('../models/user');
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
// sendgrid api key for the connection validation
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const crypto = require('crypto');
const bellData = require('./bell_controller');
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
module.exports.forgotpassword = function(req,res){
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('reset_password',{
        title:'Forgot Password'
    });
};
module.exports.resetpassword = function(req, res){
    
    User.findOne({email: req.body.email},async function(err,user){
        if(err){
            // console.log('Error while finding the user');
            req.flash('error', err); 
            console.log(`Error on searching user: forgot password stage::${err}`);
            return;
        }
        if(user){
            user.password = crypto.randomBytes(8).toString('hex');
            user.save();
            const msg = {
                to: user.email,
                from: {
                    email:process.env.SENDGRID_EMAIL,
                    name:'Everlast Notes'
                },
                templateId: process.env.RESET_PASSWORD_TEMPLATE,
                dynamic_template_data: {
                subject:'Account Password Changed',
                name:user.name,
                password:user.password
                },
            }
              try{
                await sgMail.send(msg);
                req.flash('success','Password Changed Successfully');
                // mail send then bring back user to signin page
                return res.redirect('/users/signup');
              }catch(err){
                  console.log(`Error on mail sendig : ${err}`);
                  req.flash('error','Password Reset mail cannot be sent contact Admin');
                //   else error in sending the mail then back to signup page
                  return res.redirect('users/signup');

              }            
        }else{
            console.log(`Email not sent as user does not exists`);
            req.flash('error','Email not sent as user does not exists');
            return res.redirect('/users/login');
        }
    });
}
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
                        to: user.email,
                        from: {
                            email: process.env.SENDGRID_EMAIL,
                            name:'Everlast Notes'},
                        templateId:process.env.SIGNUP_TEMPLATE,
                        dynamic_template_data: {
                        name:user.name,
                        host:req.headers.host,
                        emailToken:user.emailToken
                        },
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
module.exports.profile = async function(req,res){
    User.findById(req.params.id,async function(err, user){
        let noty = await bellData.taskData(req.user.id);
        if(err||!user){
            console.log('Error finding user with requested',err);
            return res.render('404', {
                title: '404 Page not found',
                noty:noty
            });
        }
        let rank = (((await User.find({},'email-_id').sort('-problemCount')).map(({_id}) => _id.toString()))).indexOf(user.id);
        return res.render('profile', {
            title: `Profile | ${user.name}`,
            profile_user: user,
            rank:rank+1,
            noty:noty
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
                    if(user.avatar.startsWith("/uploads") && fs.existsSync(path.join(__dirname, '..' , user.avatar))){
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