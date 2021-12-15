const mongoose=require("mongoose");
const PembayaranModel=require("../model/pembayaran");

class Other {

    static HasbeenTransaction(req,res,next){
        const {id}=req.decoded;
        PembayaranModel.aggregate([
            {
                $match:{
                    user:mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup:{
                    from:"transaksis",
                    localField:"id_transaksi",
                    foreignField:"_id",
                    as:"id_transaksi"
                }
            },{
                $unwind:"$id_transaksi"
            },
            {
                $lookup:{
                    from:"products",
                    localField:"id_transaksi.id_product",
                    foreignField:"_id",
                    as:"id_transaksi.id_product"
                }
            },{
                $unwind:"$id_transaksi.id_product"
            },
            {
                $project:{
                    "id_transaksi.createdAt":0,
                    "id_transaksi.updatedAt":0,
                    "id_transaksi.id_product.createdAt":0,
                    "id_transaksi.id_product.updatedAt":0
                }
            },{
                $group:{
                    _id:"$id_transaksi.tx_status",
                    amount:{
                        $sum:"$paid_amount"
                    },
                    total_transaction:{
                        $sum:1
                    }
                }
            },{
                $project:{
                    tx_status:"$_id",
                    amount:1,
                    total_transaction:1,
                    _id:0
                }
            }
        ]).then((data)=>{
            res.status(200).json({
                message:"Payment Transaction History",
                payload:data.length>0?data:null
            });
        }).catch(next);
    }

}

module.exports=Other;