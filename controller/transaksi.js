const orderid = require('order-id')('key');
const mongoose=require("mongoose");
const ProductModel=require("../model/product");
const TransaksiModel = require("../model/Transaksi");
const PembayaranModel = require("../model/pembayaran");

class Transaksi {

    static async TransaksiCreate(req, res, next) {
        const {id}=req.decoded;
        const {id_product}=req.params;
        const { amount } = req.body
        const session=await mongoose.startSession();
        session.startTransaction();
        try {
            
            // buat transaksi order
            let Order=await TransaksiModel.create([{user:id, nomor_order:orderid.generate(), amount, id_product }],{session});
            let TxData=await TransaksiModel.findOne({_id:Order.length>0?Order[0]._id:null}).populate("id_product",["-createdAt","-updatedAt"]).session(session);
            // buat transaksi order
            
            if(!TxData){
                throw new Error("Transaksi gagal diproses");
            }else if(!TxData.id_product){
                throw new Error("Product tidak tersedia");
            }else if(TxData.jumlah>=Number(amount)){
                throw new Error("Maaf Stok product yang diminta tidak mencukupi");
            }else{
                // buat pembayaran
                await PembayaranModel.create([{user:id,media_pembayaran:"Virtual Account",paid_amount:TxData.id_product.price*TxData.amount,id_transaksi:TxData._id,status:"pending"}],{session});
                // buat pembayaran

                // kurangin jumlah product
                await ProductModel.findOneAndUpdate({_id:id_product},{$inc:{
                    jumlah:-Number(amount)
                }},{new:true}).session(session);
                // kurangin jumlah product

                if(session.inTransaction()){
                    await session.commitTransaction();
                    await session.endSession();
                }
                res.status(200).json({
                    message: "Berhasil buat Transaksi",
                    payload: TxData
                });
            }
            
        } catch (error) {
            if(session.inTransaction()){
                await session.abortTransaction();
                await session.endSession();
            }
            next(error);
        }

    }

    static TransaksiUpdate(req, res, next) {
        const { role,id  } = req.decoded;
        const { name_Transaksi, price, jumlah, status_Transaksi } = req.body;
        const { id_transaksi } = req.params;
        if(role&&role.permission.includes("UPDATE")){
            TransaksiModel.findOneAndUpdate({ _id: id_transaksi }, {...req.body,user:id} , { new: true }).then((data) => {
                res.status(200).json({
                    message: "Transaksi berhasil diupdate",
                    payload: data
                });
            }).catch(next);
        }else{
            res.status(403).json({
                message: "Anda tidak di izinkan untuk mengedit Transaksi",
                payload: null
            });
        }
    }

    static TransaksiGet(req, res, next) {
        const {skip,limit}=req.query;
        TransaksiModel.aggregate([
            {
                $skip:skip?Number(skip):0
            },{
                $limit:limit?Number(limit):10
            },{
                $lookup:{
                    from:"products",
                    localField:"id_product",
                    foreignField:"_id",
                    as:"id_product"
                }
            },{
                $unwind:"$id_product"
            },{
                $project:{
                    "id_product.createdAt":0,
                    "id_product.updatedAt":0,
                }
            }
        ]).then((data) => {
            res.status(200).json({
                message: "List Transaksi berhasil ditampilkan",
                payload: data
            });
        }).catch(next);
    }

    static TransaksiGetOne(req, res, next) {
        const { id_transaksi } = req.params;
        TransaksiModel.findOne({ _id: id_transaksi }).then((data) => {
            res.status(200).json({
                message: "Transaksi berhasil ditampilkan",
                payload: data
            });
        }).catch(next);
    }

    static TransaksiDelete(req, res, next) {
        const { role } = req.decoded;
        const { id_transaksi } = req.params;
        if (role && role.permission.includes("DELETE")) {
            /*
            User yang di izinkan untuk menghapus data Transaksi
            */
            TransaksiModel.findOneAndDelete({ _id: id_transaksi }).then((data) => {
                res.status(200).json({
                    message: "Transaksi berhasil dihapus",
                    payload: data
                });

            }).catch(next);


        } else {
            res.status(403).json({
                message: "Anda tidak di izinkan untuk menghapus Transaksi",
                payload: null
            });
        }
    }

}

module.exports = Transaksi;