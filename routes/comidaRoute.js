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

module.exports = router;
