const RoleUser=require("../model/role");

class Role {

    static RoleCreate(req,res,next){
        const {owner,role_number,permission}=req.body;

        RoleUser.create({owner,role_number,permission}).then((data)=>{
            res.status(200).json({
                message:"Berhasil buat role",
                payload:data
            });
        }).catch(next);

    }

    static RoleUpdate(req,res,next){
        const {id}=req.decoded;
        const {id_role}=req.params;
        RoleUser.findOneAndUpdate({_id:id_role},{...req.body,user:id},{new:true}).then((data)=>{
            res.status(200).json({
                message:"Role berhasil diupdate",
                payload:data
            });
        }).catch(next);
    }

    static RoleGet(req,res,next){
        const {skip,limit}=req.query;
        RoleUser.aggregate([
            {
                $skip:skip?Number(skip):0
            },{
                $limit:limit?Number(limit):10
            }
        ]).then((data)=>{
            res.status(200).json({
                message:"List role berhasil ditampilkan",
                payload: data.length>0?data:[]
            });
        }).catch(next);
    }

    static RoleGetOne(req,res,next){
        const {id_role}=req.params;
        RoleUser.findOne({_id:id_role}).then((data)=>{
            res.status(200).json({
                message:"Role berhasil ditampilkan",
                payload:data
            });
        }).catch(next);
    }

    static RoleDelete(req,res,next){
        const {id_role}=req.params;
        RoleUser.findOneAndDelete({_id:id_role}).then((data)=>{
            res.status(200).json({
                message:"Role berhasil dihapus",
                payload:data
            });
        }).catch(next);
    }

}

module.exports=Role;