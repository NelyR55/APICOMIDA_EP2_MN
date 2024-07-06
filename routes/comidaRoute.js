const express = require('express');
const router = express.Router();
const Comida = require('../models/comida');
const autenticar = require('../middleware/autenticar');

// Ruta para obtener todas las comidas
router.get('/comida', async (req, res) => {
  try {
    const comidas = await Comida.find();
    res.json(comidas);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// Ruta para obtener una comida por nombre
router.get('/comida/:nombre', obtenerComidaPorNombre, (req, res) => {
  res.json(res.comida);
});

// Ruta para obtener comidas por categoría
router.get('/comida/categoria/:categoria', async (req, res) => {
  try {
    const comidas = await Comida.find({ categoria: new RegExp(req.params.categoria, 'i') });
    if (comidas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron comidas' });
    }
    res.json(comidas);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// Ruta para obtener comidas en un rango de precios
router.get('/comida/precio/:min/:max', async (req, res) => {
  const minPrecio = parseFloat(req.params.min);
  const maxPrecio = parseFloat(req.params.max);
  
  try {
    const comidas = await Comida.find({ precio: { $gte: minPrecio, $lte: maxPrecio } });
    if (comidas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron comidas' });
    }
    res.json(comidas);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// Ruta para obtener comidas con un precio exacto
router.get('/comida/precioex/:precio', async (req, res) => {
  const precio = parseFloat(req.params.precio);

  try {
    const comidas = await Comida.find({ precio: precio });
    if (comidas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron comidas' });
    }
    res.json(comidas);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// Ruta protegida para agregar una nueva comida
router.post('/comida', autenticar, async (req, res) => {
  // Verificar si el usuario tiene el permiso de agregar comida
  if (!req.usuario.aprobado) {
    return res.status(403).json({ mensaje: 'Acceso denegado. Solo usuarios aprobados pueden agregar comida.' });
  }

  const comida = new Comida({
    nombre: req.body.nombre,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria
  });

  try {
    const agregarComida = await comida.save();
    res.status(201).json(agregarComida);
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
  }
});

// Ruta protegida para actualizar una comida
router.put('/comida/:nombre', autenticar, obtenerComidaPorNombre, async (req, res) => {
  // Verificar si el usuario tiene el permiso de editar comida
  if (!req.usuario.aprobado) {
    return res.status(403).json({ mensaje: 'Acceso denegado. Solo usuarios aprobados pueden editar comida.' });
  }

  if (req.body.nombre != null) {
    res.comida.nombre = req.body.nombre;
  }
  if (req.body.precio != null) {
    res.comida.precio = req.body.precio;
  }
  if (req.body.descripcion != null) {
    res.comida.descripcion = req.body.descripcion;
  }
  if (req.body.categoria != null) {
    res.comida.categoria = req.body.categoria;
  }

  try {
    const comidaActualizada = await res.comida.save();
    res.json(comidaActualizada);
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
  }
});

// Ruta protegida para eliminar una comida
router.delete('/comida/:nombre', autenticar, async (req, res) => {
  // Verificar si el usuario tiene el permiso de eliminar comida
  if (!req.usuario.aprobado) {
    return res.status(403).json({ mensaje: 'Acceso denegado. Solo usuarios aprobados pueden eliminar comida.' });
  }

  try {
    const comidaEliminada = await Comida.findOneAndDelete({ nombre: new RegExp(req.params.nombre, 'i') });
    if (!comidaEliminada) {
      return res.status(404).json({ mensaje: 'No se encontró la comida' });
    }
    res.json({ mensaje: 'Comida eliminada' });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// Middleware para obtener comida por nombre
async function obtenerComidaPorNombre(req, res, next) {
  let comida;
  try {
    comida = await Comida.findOne({ nombre: new RegExp(req.params.nombre, 'i') });
    if (comida == null) {
      return res.status(404).json({ mensaje: 'Comida no encontrada' });
    }
  } catch (err) {
    return res.status(500).json({ mensaje: err.message });
  }

  res.comida = comida;
  next();
}

module.exports = router;
