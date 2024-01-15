import mongoose, { models,model,Schema} from 'mongoose';

const SemillaSchema = new Schema({
  name: { type: String, required:true },
  parent: { type: mongoose.Types.ObjectId, ref:'Semilla'},
  properties: [{type:Object}]
});

const Semilla = models?.Semilla || model('Semilla', SemillaSchema);

export default Semilla;

