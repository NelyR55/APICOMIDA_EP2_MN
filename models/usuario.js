const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  aprobado: { type: Boolean, default: false }  // Nuevo campo para verificar aprobación
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
