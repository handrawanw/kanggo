const express=require("express");
const Router=express.Router();

const {TransaksiCreate,TransaksiDelete,TransaksiGet,TransaksiGetOne,TransaksiUpdate}=require("../controller/transaksi");

// Authentikasi
const {AuthJWT}=require("../middleware/auth");
// Authentikasi

Router.get("/",AuthJWT,TransaksiGet);
Router.get("/detail",AuthJWT,TransaksiGetOne);

Router.post("/create/:id_product",AuthJWT,TransaksiCreate);

Router.patch("/edit/:id_transaksi",AuthJWT,TransaksiUpdate);

Router.delete("/remove/:id_transaksi",AuthJWT,TransaksiDelete);

module.exports=Router;