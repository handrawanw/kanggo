const express=require("express");
const Router=express.Router();

const {ProductCreate,ProductDelete,ProductGet,ProductGetOne,ProductUpdate}=require("../controller/product");

// Authentikasi JWT
const {AuthJWT}=require("../middleware/auth");
// Authentikasi JWT

Router.get("/",AuthJWT,ProductGet);

Router.post("/register",AuthJWT,ProductCreate);

Router.patch("/edit/:id_product",AuthJWT,ProductUpdate);

Router.delete("/remove/:id_product",AuthJWT,ProductDelete);

module.exports=Router;