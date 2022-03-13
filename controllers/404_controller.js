const bellData = require('./bell_controller');
module.exports.notFound = async function(req,res){
    let noty = await bellData.taskData(req.user.id);
    return res.render('404', {
        title: '404 Page not found',
        noty:noty
    });
};
