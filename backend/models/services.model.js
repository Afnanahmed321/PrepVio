import mongoose from 'mongoose';

const servicesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // You can add more fields here if needed
});

const servicesModel = mongoose.model('Service', servicesSchema);

export default servicesModel
