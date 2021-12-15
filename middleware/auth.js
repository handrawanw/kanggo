const {verifytoken}=require("../helper/jwttoken");

class Auth {

    static AuthJWT(req,res,next){
        let token=req.headers.token;
        verifytoken(token,(err,payload)=>{
            if(err){
                res.status(401).json({
                    message:"Anda harus login terlebih dahulu",
                    status:401
                });
            }else{
                req.decoded=payload;
                next();
            }
        });
    }

    static AuthRole(req,res,next){
        const {role}=req.decoded;
        /*
            Fungsi ini untuk controller role.js
            Authetikasi fungsi role yang bisa create update dan delete
            dan ditaro di middleware ditempatkan di tengah-2 router
        */
        if(role&&role.role_number===20){
            next();
        }else{
            res.status(403).json({
                message:"Anda tidak punya akses untuk Role",
                status:403
            });
        }
    }

}

module.exports=Auth;