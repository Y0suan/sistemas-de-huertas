import mongoose, { models,model,Schema} from 'mongoose';

const PlantinSchema = new Schema({
  name: { type: String, required:true },
  parent: { type: mongoose.Types.ObjectId, ref:'Plantin'},
  properties: [{type:Object}]
});

const Plantin = models?.Plantin || model('Plantin', PlantinSchema);

export default Plantin;

