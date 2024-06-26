const express = require('express');
const router = express.Router();
const Comida = require('../models/comida');

// CONSULTAR TODOS
router.get('/comida', async (req, res) => {
  try {
    const comidas = await Comida.find();
    res.json(comidas);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// CONSULTAR POR NOMBRE
router.get('/comida/:nombre', obtenerComidaPorNombre, (req, res) => {
  res.json(res.comida);
});

// CONSULTAR POR CATEGORÍA
router.get('/comida/categoria/:categoria', async (req, res) => {
  try {
    const comidas = await Comida.find({ categoria: req.params.categoria });
    if (comidas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron comidas' });
    }
    res.json(comidas);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// INSERTAR
router.post('/comida', async (req, res) => {
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
    res.status(400).json({ mensaje: err.message });
  }
});

async function obtenerComidaPorNombre(req, res, next) {
  let comida;
  try {
    comida = await Comida.findOne({ nombre: req.params.nombre });
    if (comida == null) {
      return res.status(404).json({ mensaje: 'Platillo no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ mensaje: err.message });
  }

  res.comida = comida;
  next();
}
// ACTUALIZAR
router.put('/comida/:nombre', obtenerComidaPorNombre, async (req, res) => {
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
// ELIMINAR POR NOMBRE
router.delete('/comida/:nombre', async (req, res) => {
  try {
    const comidaEliminada = await Comida.findOneAndDelete({ nombre: req.params.nombre });
    if (!comidaEliminada) {
      return res.status(404).json({ mensaje: 'No se encontró la comida' });
    }
    res.json({ mensaje: 'Comida eliminada' });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});
module.exports = router;
