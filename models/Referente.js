import mongoose, { models,model,Schema} from 'mongoose';

const ReferenteSchema = new Schema({
  name: { type: String, required:true },
  parent: { type: mongoose.Types.ObjectId, ref:'Referente'},
  properties: [{type:Object}]
});

const Referente = models?.Referente || model('Referente', ReferenteSchema);

export default Referente;

