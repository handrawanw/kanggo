module.exports=function(err,req,res,next){
    let message=err.message||"Internal server error";
    console.log(err);
    res.status(500).json({
        message,
        status:500
    });
}