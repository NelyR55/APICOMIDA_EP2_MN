const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const nodemailer = require('nodemailer');

const JWT_SECRET = 'MaryVillan565250'; 

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Registro
router.post('/registro', async (req, res) => {
  const { nombre, contrasena } = req.body;

  try {
    const usuario = new Usuario({ nombre, contrasena, aprobado: false });
    await usuario.save();

    // Enviar correo de solicitud de registro
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'nelyr844@gmail.com',
      subject: 'Nueva Solicitud de Registro',
      text: `Usuario: ${nombre}\nPor favor, revisa la solicitud de registro y acepta o rechaza la solicitud.`
    });

    res.status(201).json({ mensaje: 'Usuario registrado. Espera aprobación.' });
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

    if (!usuario.aprobado) {
      return res.status(403).json({ mensaje: 'Solicitud no aprobada' });
    }

    const token = jwt.sign({ id: usuario._id, nombre: usuario.nombre }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

// Aceptar solicitud de registro
router.post('/aceptar-solicitud', async (req, res) => {
  const { nombre } = req.body;

  try {
    const usuario = await Usuario.findOne({ nombre });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.aprobado = true;
    await usuario.save();

    const token = jwt.sign({ id: usuario._id, nombre: usuario.nombre }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

module.exports = router;
