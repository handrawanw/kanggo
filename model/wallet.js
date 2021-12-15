const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const WalletSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    name_wallet:{
        type:String,
        default:"Virtual Account"
    },
    amount:{
        type:Number,
        default:1e+6 // 1 Juta
    },
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

module.exports=mongoose.models.wallet||mongoose.model("wallet",WalletSchema);