const express=require("express");
const Router=express.Router();

const {RoleCreate,RoleDelete,RoleGet,RoleGetOne,RoleUpdate}=require("../controller/role");

// Authentikasi
const {AuthJWT,AuthRole}=require("../middleware/auth");
// Authentikasi

Router.get("/",AuthJWT,RoleGet);

Router.post("/register",AuthJWT,AuthRole,RoleCreate);

Router.patch("/edit/:id_role",AuthJWT,AuthRole,RoleUpdate);

Router.delete("/remove/:id_role",AuthJWT,AuthRole,RoleDelete);

module.exports=Router;