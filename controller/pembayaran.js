const mongoose = require("mongoose");
const PembayaranModel=require("../model/pembayaran");
const TransaksiModel=require("../model/transaksi");
const Wallet=require("../model/wallet");

class Pembayaran {

    static AllPembayaran(req,res,next){
        const {skip,limit}=req.query;
        PembayaranModel.aggregate([
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
                $skip:skip?Number(skip):0
            },{
                $limit:limit?Number(limit):10
            }
        ]).then((data)=>{
            res.status(200).json({
                message:"List data pembayaran",
                payload:data
            });
        }).catch(next);
    }

    static OnePembayaran(req,res,next){
        const {id_transaksi}=req.params;
        PembayaranModel.aggregate([
            {
                $match:{
                    id_transaksi:mongoose.Types.ObjectId(id_transaksi)
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
            }
        ]).then((data)=>{
            res.status(200).json({
                message:"Detail pembayaran",
                payload:data.length>0?data[0]:null
            });
        }).catch(next);
    }

    static async updatePembayaran(req,res,next){
        const {id}=req.decoded;
        const {id_transaksi}=req.params;
        const session=await mongoose.startSession();
        session.startTransaction();
        try {
            let data=await PembayaranModel.aggregate([
                {
                    $match:{
                        id_transaksi:mongoose.Types.ObjectId(id_transaksi),
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
                    $project:{
                        "id_transaksi.createdAt":0,
                        "id_transaksi.updatedAt":0,
                        "id_transaksi.id_product":0
                    }
                }
            ]).session(session);
            let TxData=data.length>0?data[0]:null;
            let AccountWallet=await Wallet.findOne({user:id}).session(session);
            if(!AccountWallet){
                throw new Error("Wallet tidak ditemukan");
            }else if(AccountWallet.amount<TxData.paid_amount){
                throw new Error("Saldo tidak mencukupi, silakan topup terlebih dahulu");
            }else if(TxData){
                AccountWallet.amount-=Number(TxData.paid_amount);
                await AccountWallet.save({session});
                let TxDataPM=await PembayaranModel.findOneAndUpdate({
                    _id:TxData._id,status:"pending"
                },{
                    status:"success"
                },{new:true,session});
                await TransaksiModel.findOneAndUpdate({
                    _id:TxData.id_transaksi._id,tx_status:"pending"
                },{
                    tx_status:"paid"
                },{new:true,session});
                if(TxDataPM){
                    if(session.inTransaction()){
                        await session.commitTransaction();
                        await session.endSession();
                    }
                     res.status(200).json({
                        message:"Pembayaran berhasil",
                        payload:TxDataPM
                    });
                }else{
                    res.status(200).json({
                        message:"Transaksi ini telah dibayar",
                        payload:null
                    });
                }
            }else{
                throw new Error("Pembayaran ini tidak tersedia atau tidak dapat dilakukan");
            }
        } catch (error) {
            if(session.inTransaction()){
                await session.abortTransaction();
                await session.endSession();
            }
            next(error);
        }
    }

}

module.exports=Pembayaran;