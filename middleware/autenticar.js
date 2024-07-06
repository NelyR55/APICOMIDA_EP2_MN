const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const JWT_SECRET = 'MaryVillan565250'; 

function autenticar(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado' });
  }

  try {
    const verificado = jwt.verify(token, JWT_SECRET);
    req.usuario = verificado;

    // Verificar si el usuario está aprobado
    Usuario.findById(verificado.id, (err, usuario) => {
      if (err || !usuario || !usuario.aprobado) {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
      }
      next();
    });

  } catch (err) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
}

module.exports = autenticar;
