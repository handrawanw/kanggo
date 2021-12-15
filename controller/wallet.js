const WalletUser=require("../model/wallet");

class Wallet {

    static WalletUpdate(req,res,next){
        const {id}=req.decoded;
        const {id_wallet}=req.params;
        const {amount}=req.body;
        WalletUser.findOneAndUpdate({_id:id_wallet},{$inc:{amount:+Number(amount)}},{new:true}).then((data)=>{
            res.status(200).json({
                message:"Wallet berhasil diupdate",
                payload:data
            });
        }).catch(next);
    }

    static WalletGetOne(req,res,next){
        const {id}=req.decoded;
        WalletUser.findOne({user:id}).then((data)=>{
            res.status(200).json({
                message:"Wallet berhasil ditampilkan",
                payload:data
            });
        }).catch(next);
    }

}

module.exports=Wallet;