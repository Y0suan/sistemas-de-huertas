import mongoose, {model, Schema, models} from "mongoose";

const HuertaSchena = new Schema({
    referente:String,
    dni:String,
    calle:String,
    km:String,
    barrio:String,
    fecha:String,
    superficie:String,
    entregado:String,
    properties: [{type:Object}],
    images:[{type:String}],
},{
    timestamps: true,
});

export const Huerta = models.Huerta || model('Huerta',HuertaSchena);
