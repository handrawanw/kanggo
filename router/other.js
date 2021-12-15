const express=require("express");
const Router=express.Router();

const {HasbeenTransaction}=require("../controller/other");

// Authentikasi
const {AuthJWT}=require("../middleware/auth");
// Authentikasi

Router.get("/transaction",AuthJWT,HasbeenTransaction);

module.exports=Router;