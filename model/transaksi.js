const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const TransaksiSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    nomor_order:{
        type:String,
        required:["nomor order tidak boleh kosong",true]
    },
    tx_status:{
        type:String,
        enum:["pending","cancel","paid"],
        default:"pending"
    },
    amount:{
        type:Number,
        required:["amount tidak boleh kosong",true]
    },
    id_product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
    }
},{
    timestamps:{
        createdAt:"createdAt" 
    }
});

module.exports=mongoose.models.transaksi||mongoose.model("transaksi",TransaksiSchema);
