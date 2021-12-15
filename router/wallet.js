const express=require("express");
const Router=express.Router();

const {WalletGetOne,WalletUpdate}=require("../controller/wallet");

// Authentikasi
const {AuthJWT}=require("../middleware/auth");
// Authentikasi

Router.get("/",AuthJWT,WalletGetOne);

Router.patch("/topup/:id_wallet",AuthJWT,WalletUpdate);

module.exports=Router;