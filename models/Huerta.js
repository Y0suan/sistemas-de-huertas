import mongoose, {model, Schema, models} from "mongoose";

const HuertaSchena = new Schema({
    referente:{type:mongoose.Types.ObjectId,ref:'Referente'},
    fecha: String,
    ubicacion: String,
    ancho: Number,
    largo: Number,
    plantines: String,
    plantinesCantidad: String,
    semillas: String,
    semillasCantidad: String,
    herramientas: String,
    images:[{type:String}],
},{
    timestamps: true,
});

export const Huerta = models.Huerta || model('Huerta',HuertaSchena);
