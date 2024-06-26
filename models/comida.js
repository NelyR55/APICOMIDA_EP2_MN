const mongoose = require('mongoose');

const comidaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true 
  },
  precio: {
    type: Number,
    required: true,
    min: 0 
  },
  descripcion: {
    type: String,
    required: true,
    trim: true 
  },
  categoria: {
    type: String,
    required: true,
    trim: true 
  }
}, {
  timestamps: true 
});
module.exports = mongoose.model('Comida', comidaSchema);
