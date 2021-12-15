const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const RoleSchema=new Schema({
    owner:{
        type:String,
        default:"User"
    },
    role_number:{
        type:Number,
        default:0
    },
    permission:{
        type:Array,
        // CREATE, VIEW, UPDATE, DELETE
        default:["CREATE","VIEW"]
    },
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

module.exports=mongoose.models.role||mongoose.model("role",RoleSchema);