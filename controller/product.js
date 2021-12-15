const ProductModel = require("../model/product");

class Product {

    static ProductCreate(req, res, next) {
        const { name_product, price, jumlah, satuan } = req.body;

        ProductModel.create({ name_product,status_product:"tersedia", price, jumlah, satuan }).then((data) => {
            res.status(200).json({
                message: "Berhasil buat Product",
                payload: data
            });
        }).catch(next);

    }

    static ProductUpdate(req, res, next) {
        const { role, id } = req.decoded;
        const { id_product } = req.params;
        if(role&&role.permission.includes("UPDATE")){
            ProductModel.findOneAndUpdate({ _id: id_product }, {...req.body,user:id}, { new: true, upsert:false }).then((data) => {
                res.status(200).json({
                    message: "Product berhasil diupdate",
                    payload: data
                });
            }).catch(next);
        }else{
            res.status(403).json({
                message: "Anda tidak di izinkan untuk mengedit product",
                payload: null
            });
        }
    }

    static ProductGet(req, res, next) {
        const {skip,limit}=req.query;
        ProductModel.aggregate([
            {
                $skip:skip?Number(skip):0
            },{
                $limit:limit?Number(limit):10
            }
        ]).then((data) => {
            res.status(200).json({
                message: "List Product berhasil ditampilkan",
                payload: data.length>0?data:[]
            });
        }).catch(next);
    }

    static ProductGetOne(req, res, next) {
        const { id_product } = req.params;
        ProductModel.findOne({ _id: id_product }).then((data) => {
            res.status(200).json({
                message: "Product berhasil ditampilkan",
                payload: data
            });
        }).catch(next);
    }

    static ProductDelete(req, res, next) {
        const { role } = req.decoded;
        const { id_product } = req.params;
        if (role && role.permission.includes("DELETE")) {
            /*
            User yang di izinkan untuk menghapus data Product
            */
            ProductModel.findOneAndDelete({ _id: id_product }).then((data) => {
                res.status(200).json({
                    message: "Product berhasil dihapus",
                    payload: data
                });

            }).catch(next);


        } else {
            res.status(403).json({
                message: "Anda tidak di izinkan untuk menghapus product",
                payload: null
            });
        }
    }

}

module.exports = Product;