require('dotenv').config();
const CronJob = require('cron').CronJob;
const User =require('../models/user');
const sgMail = require('@sendgrid/mail');
// sendgrid api key for the connection validation
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
new CronJob(process.env.INTERVAL,async function(){
    let userData = await User.find({},'email name todos');
    userData.forEach(user => {
        if(user.todos > 0){
            let msg = {
                to: user.email,
                from: {
                    email: process.env.SENDGRID_EMAIL,
                    name: 'Everlast Notes'
                },
                templateId: process.env.TODO_TEMPLATE,
                dynamic_template_data: {
                    name: user.name,
                    tasks: user.todos,
                    host: process.env.HOST
                }
            };
            console.log(msg);
            sgMail.send(msg);
        }
    });
},null,true,'Asia/Kolkata');