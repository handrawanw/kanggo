const express=require("express");
const Router=express.Router();

const {AllPembayaran,OnePembayaran,updatePembayaran}=require("../controller/pembayaran");

// Authentikasi
const {AuthJWT}=require("../middleware/auth");
// Authentikasi

Router.get("/",AuthJWT,AllPembayaran);
Router.get("/one/:id_transaksi",AuthJWT,OnePembayaran);

Router.patch("/edit/:id_transaksi",AuthJWT,updatePembayaran);

module.exports=Router;