const User =require('../models/user');
const Problem =require('../models/problem');
const bellData = require('./bell_controller');
module.exports.home = function(req,res){
    User.findById(req.user.id,async function(err, user){
        if(err){
            console.log('Error finding user with requested',err);
            return;
        }
        let rank = (((await User.find({},'email-_id').sort('-problemCount')).map(({_id}) => _id.toString()))).indexOf(user.id);
        let toppers = await User.find().sort('-problemCount').limit(10);
        let recents = await Problem.find({author:req.user}).sort('-createdAt').limit(10);
        const chartData= new Array();
        for (let val of user.problems) {
            chartData.push({category:val[0],progress:{solved:val[1],link:`/category/${val[0].replace(' ','+')}`}});
        }
        console.log(chartData);
        let noty = await bellData.taskData(req.user.id);
        return res.render('dashboard', {
            title: `Dashboard | ${user.name}`,
            user,
            rank:rank+1,
            toppers,
            recents,
            chartData,
            noty:noty
        });
    });
};
