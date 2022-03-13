const bellData = require('./bell_controller');
module.exports.contestPage = async function(req,res){
    try{
        let noty = await bellData.taskData(req.user.id);
        return res.render('contest',{
            title:'Contests',
            noty:noty
        });
    }catch(err){
        req.flash('error', err);
        console.log('Contest Page Render :: Error :',err);
        return res.redirect('back');
    }
};