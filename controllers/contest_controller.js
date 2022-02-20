module.exports.contestPage = async function(req,res){
    try{
        return res.render('contest',{
            title:'Contests',
        });
    }catch(err){
        req.flash('error', err);
        console.log('Contest Page Render :: Error :',err);
        return res.redirect('back');
    }
};