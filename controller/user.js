const mongoose=require("mongoose");
const UsersModel=require("../model/users");
const RoleUser=require("../model/role");
const Wallet=require("../model/wallet");

// helpers
const {checkPass,hashPass}=require("../helper/hash");
const {generateToken}=require("../helper/jwttoken");
// helpers

class User {

    static Login(req,res,next){
        let {email,password}=req.body;
        UsersModel.findOne({
            email
        }).populate("role",["role_number","owner","permission"]).then((data)=>{
            if(data){
                let ValidPassword = checkPass(password, data.password);
                /*
                        checkPass fungsi untuk membandingkan password dalam bentuk hash
                        fungsinya ada di helper hash.js
                    */
                if (ValidPassword) {
                    let Payload = generateToken({
                        id: data._id,
                        username: data.username,
                        fullname: data.fullname,
                        role: data.role,
                        id_supplier: data.id_supplier
                    });
                    /*
                        generateToken fungsi sign jwt token untuk generate token dalam bentuk hash dari jwt
                        fungsinya ada di helper jwttoken.js
                    */
                    res.status(200).json({
                        message: "Login berhasil",
                        token:Payload
                    });
                } else {
                    throw new Error("Username atau Password salah");
                }
            }else{
                throw new Error(`Username atau Password salah`);
            }
        }).catch(next);
    }

    static Daftar(req,res,next){
        const { username, password, fullname, role, email } = req.body;
        UsersModel.findOne({email}).then(async (Users) => {
            if(Users){
                throw new Error("Email telah terdaftar");
            }else{
                let Role=await RoleUser.findOne({role_number:role});
                if(!Role) throw new Error(`Role${role?" "+role+" ":" "}tidak tersedia`);
                let Account = await UsersModel.create({ username, password, fullname, role, email, role:Role._id });
                if (Account) {
                    await Wallet.create({user:Account._id});
                    Account.password = hashPass(Account.password);
                    let StatusSave = await Account.save();
                    /*
                        hashPass untuk encrypt password ke hash
                        fungsinya ada di helper pakai bcrypt.js
                    */
                    res.status(200).json({
                        message: "Successfull Register",
                        User: StatusSave
                    });
                } else {
                    throw new Error("Username gagal terdaftar");
                }
            }
        }).catch(next);
    }

    static UserAll(req,res,next){
        const {skip,limit}=req.query;
        UsersModel.aggregate([
            {
                $skip:skip?Number(skip):0
            },{
                $limit:limit?Number(limit):10
            },{
                $project:{
                    "password":0,
                    "_id":0,
                }
            }
        ]).then((data)=>{
            res.status(200).json({
                message:"Data user berhasil ditampilkan",
                payload:data
            });
        }).catch(next);
    }

    static UpdateUser(req,res,next){
        const {id_user}=req.params;
        UsersModel.findOneAndUpdate({_id:id_user},{...req.body,user:id},{new:true,upsert:false}).then((data)=>{
            res.status(200).json({
                message:"Data user berhasil diperbarui",
                payload:data
            });
        }).catch(next);
    }

    static DeleteUser(req,res,next){
        const {role}=req.decoded;
        const {id_user}=req.params;

        UsersModel.findOne({_id:id_user}).then((data)=>{
            if(role&&role.permission.includes("DELETE")){
                /*
                    User yang di izinkan untuk menghapus data User
                */
                res.status(200).json({
                    message:"User berhasil dihapus",
                    payload:data
                });

            }else{
                res.status(403).json({
                    message:"Anda tidak di izinkan untuk menghapus user",
                    payload:null
                });
            }

        }).catch(next);

    }

}

module.exports=User;