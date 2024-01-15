import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Huerta } from "@/models/Huerta";


export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);


    if (method === 'GET'){
        if (req.query?.id){
            res.json(await Huerta.findOne({_id:req.query.id}));
        }else{
            res.json(await Huerta.find());
        }
    }

    if (method === 'POST'){
        const {referente,fecha,ubicacion,ancho,largo,plantines,plantinesCantidad,semillas,semillasCantidad,herramientas,images} = req.body;
        const productDoc = await Huerta.create({
            referente,fecha,ubicacion,ancho,largo,plantines,plantinesCantidad,semillas,semillasCantidad,herramientas,images
        })
        res.json(productDoc);
    }
    if (method === 'PUT') {
        const {
            referente,
            fecha,
            ubicacion,
            ancho,
            largo,
            plantines,
            plantinesCantidad,
            semillas,
            semillasCantidad,
            herramientas,
            images,
            _id
        } = req.body;
    
        await Huerta.updateOne({ _id }, {
            $set: {
                referente,
                fecha,
                ubicacion,
                ancho,
                largo,
                plantines,
                plantinesCantidad,
                semillas,
                semillasCantidad,
                herramientas,
                images
            }
        });
    
        res.json(true);
    }
    

    if (method === 'DELETE'){
        if (req.query?.id){
            await Huerta.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}