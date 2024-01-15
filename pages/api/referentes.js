import { mongooseConnect } from "@/lib/mongoose";
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { isAdminRequest } from "./auth/[...nextauth]";
import Referente from "@/models/Referente";

export default async function handle(req,res){
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);


    if (method === 'GET'){
        res.json(await Referente.find().populate('parent'));
    }


    if (method === 'POST'){
        const { name, parentReferente,properties} = req.body;
    
        let parent = null;
        if (parentReferente) {
            parent = new mongoose.Types.ObjectId(parentReferente);
        }
    
        const categoryDoc = await Referente.create({
            name,
            parent: parentReferente || undefined ,
            properties,
        });
        res.json(categoryDoc);
    }  


    if (method === 'PUT'){
        const { name, parentCategory,properties,_id} = req.body;


        let parent = null;
        if (parentCategory) {
            parent = new mongoose.Types.ObjectId(parentCategory);
        }

        const categoryDoc = await Referente.updateOne({_id},{
            name,
            parent: parentCategory || undefined ,
            properties,
        });
        res.json(categoryDoc);
    }


    if (method === 'DELETE'){
        const {_id} = req.query;
        await Referente.deleteOne({_id});
        res.json('ok');
    }
    
}