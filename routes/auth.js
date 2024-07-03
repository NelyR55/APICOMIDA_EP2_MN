const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const JWT_SECRET = 'MaryVillan565250'; 

// Registro
router.post('/registro', async (req, res) => {
  const { nombre, contrasena } = req.body;

  try {
    const usuario = new Usuario({ nombre, contrasena });
    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado' });
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { nombre, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ nombre });
    if (!usuario || !await bcrypt.compare(contrasena, usuario.contrasena)) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: usuario._id, nombre: usuario.nombre }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

module.exports = router;
