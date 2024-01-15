import { mongooseConnect } from "@/lib/mongoose";
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { isAdminRequest } from "./auth/[...nextauth]";
import Semilla from "@/models/Semillas";

export default async function handle(req,res){
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);


    if (method === 'GET'){
        res.json(await Semilla.find().populate('parent'));
    }


    if (method === 'POST'){
        const { name, parentSemilla,properties} = req.body;
    
        let parent = null;
        if (parentSemilla) {
            parent = new mongoose.Types.ObjectId(parentSemilla);
        }
    
        const SemillaDoc = await Semilla.create({
            name,
            parent: parentSemilla || undefined ,
            properties,
        });
        res.json(SemillaDoc);
    }  


    if (method === 'PUT'){
        const { name, parentSemilla,properties,_id} = req.body;


        let parent = null;
        if (parentSemilla) {
            parent = new mongoose.Types.ObjectId(parentSemilla);
        }

        const SemillaDoc = await Semilla.updateOne({_id},{
            name,
            parent: parentSemilla || undefined ,
            properties,
        });
        res.json(SemillaDoc);
    }


    if (method === 'DELETE'){
        const {_id} = req.query;
        await Semilla.deleteOne({_id});
        res.json('ok');
    }
    
}