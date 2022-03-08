module.exports.notFound = function(req,res){
    return res.render('404', {
        title: '404 Page not found',
    });
};
