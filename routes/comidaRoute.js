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


module.exports = router;
