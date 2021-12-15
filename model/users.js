const mongoose=require("mongoose");
const {isEmail}=require("validator");

const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username:{
        type:String,
        required:["Username tidak boleh kosong",true]
    },
    email:{
        type:String,
        lowercase:true,
        validate:[isEmail,"Email tidak valid"],
        required:["Email tidak boleh kosong",true]
    },
    password:{
        type:String,
        required:["Password tidak boleh kosong",true]
    },
    fullname:{
        type:String,
        required:["Nama lengkap tidak boleh kosong",true]
    },
    verification:{
        type:Boolean,
        default:true
    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'role',
    }
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

module.exports=mongoose.models.user||mongoose.model("user",UserSchema);