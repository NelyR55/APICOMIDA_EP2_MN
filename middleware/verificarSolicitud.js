const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const JWT_SECRET = 'MaryVillan565250'; 

async function verificarSolicitud(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado' });
  }

  try {
    const verificado = jwt.verify(token, JWT_SECRET);
    req.usuario = verificado;

    const usuario = await Usuario.findById(verificado.id);
    if (!usuario || !usuario.aprobado) {
      return res.status(403).json({ mensaje: 'Solicitud no aprobada' });
    }

    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
}

module.exports = verificarSolicitud;
