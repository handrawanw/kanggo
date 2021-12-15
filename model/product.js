const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const ProductSchema=new Schema({
    name_product:{
        type:String,
        required:["nama product tidak boleh kosong",true]
    },
    price:{
        type:Number,
        required:["price tidak boleh kosong",true]
    },
    jumlah:{
        type:Number,
        required:["jumlah tidak boleh kosong",true]
    },
    satuan:{
        type:String,
        required:["satuan tidak boleh kosong",true]
    },
    status_product:{
        type:String,
        enum:["tersedia","stock habis"],
        required:["status product tidak boleh kosong",true],
    }
},{
    timestamps:{
        createdAt:"createdAt"
    }
});


module.exports=mongoose.models.product||mongoose.model("product",ProductSchema);
