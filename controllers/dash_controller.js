module.exports.home = function(req,res){
    return res.render('dashboard',{
        title:'Dashboard'
    });

};