const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  verificado: { type: Boolean, default: false } // Añadir el campo 'verificado'
});

usuarioSchema.pre('save', async function (next) {
  const usuario = this;
  if (usuario.isModified('contrasena')) {
    usuario.contrasena = await bcrypt.hash(usuario.contrasena, 8);
  }
  next();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
