const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const PembayaranSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    media_pembayaran:{
        type:String,
        required:["media pembayaran tidak boleh kosong",true]
    },
    description:{
        type:String,
        default:""
    },
    status:{
        type:String,
        enum:["success","pending","failed","cancel"],
        required:["status tidak boleh kosong",true],
        default:"pending"
    },
    paid_amount:{
        type:Number,
        required:["paid amount tidak boleh kosong",true]
    },
    id_transaksi:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'transaksi',
    }
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

module.exports=mongoose.models.pembayaran||mongoose.model("pembayaran",PembayaranSchema);
