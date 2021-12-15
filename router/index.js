const express=require("express");
const Router=express.Router();

// Router file
const UsersRouter=require("./users");
const RoleRouter=require("./role");
const ProductRouter=require("./product");
const TransaksiRouter=require("./transaksi");
const PembayaranRouter=require("./pembayaran");
const Wallet=require("./wallet");
const Other=require("./other");
// Router file

// Register Router
Router.use("/user",UsersRouter);
Router.use("/role",RoleRouter);
Router.use("/product",ProductRouter);
Router.use("/transaksi",TransaksiRouter);
Router.use("/pembayaran",PembayaranRouter);
Router.use("/wallet",Wallet);
Router.use("/other",Other);
// Register Router

module.exports=Router;
