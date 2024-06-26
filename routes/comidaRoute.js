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

module.exports = router;
