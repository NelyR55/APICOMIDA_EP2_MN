const jwt = require('jsonwebtoken');
const JWT_SECRET = 'MaryVillan565250'; // Usa la misma cadena secreta

function autenticar(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado' });
  }

  try {
    const verificado = jwt.verify(token, JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
}

function autorizarPermisos(permisosRequeridos) {
  return (req, res, next) => {
    if (req.usuario.permisos !== permisosRequeridos) {
      return res.status(403).json({ mensaje: 'Permisos insuficientes' });
    }
    next();
  };
}

module.exports = { autenticar, autorizarPermisos };
