import { mongooseConnect } from "@/lib/mongoose";
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { isAdminRequest } from "./auth/[...nextauth]";
import Referente from "@/models/Referente";
import Plantin from "@/models/Plantines";

export default async function handle(req,res){
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);


    if (method === 'GET'){
        res.json(await Plantin.find().populate('parent'));
    }


    if (method === 'POST'){
        const { name, parentPlantin,properties} = req.body;
    
        let parent = null;
        if (parentPlantin) {
            parent = new mongoose.Types.ObjectId(parentPlantin);
        }
    
        const plantinDoc = await Plantin.create({
            name,
            parent: parentPlantin || undefined ,
            properties,
        });
        res.json(plantinDoc);
    }  


    if (method === 'PUT'){
        const { name, parentPlantin,properties,_id} = req.body;


        let parent = null;
        if (parentPlantin) {
            parent = new mongoose.Types.ObjectId(parentPlantin);
        }

        const plantinDoc = await Plantin.updateOne({_id},{
            name,
            parent: parentPlantin || undefined ,
            properties,
        });
        res.json(plantinDoc);
    }


    if (method === 'DELETE'){
        const {_id} = req.query;
        await Plantin.deleteOne({_id});
        res.json('ok');
    }
    
}