const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const nodemailer = require('nodemailer');

const JWT_SECRET = 'MaryVillan565250'; 
const ADMIN_EMAIL = 'nelyr844@gmail.com'; // Email del administrador

// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: ADMIN_EMAIL,
    pass: 'contraseña_de_aplicación' // Usa la contraseña de aplicación generada
  }
});

// Registro
router.post('/registro', async (req, res) => {
  const { nombre, contrasena } = req.body;

  try {
    const usuario = new Usuario({ nombre, contrasena, aprobado: false });
    await usuario.save();

    // Enviar correo de solicitud de aprobación
    const mailOptions = {
      from: ADMIN_EMAIL,
      to: ADMIN_EMAIL,
      subject: 'Solicitud de Registro',
      text: `Nuevo usuario registrado: ${nombre}. Aprobar o rechazar la solicitud.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ mensaje: 'Error al enviar el correo de solicitud.' });
      }
      res.status(201).json({ mensaje: 'Usuario registrado. Pendiente de aprobación.' });
    });

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

    // Verificar si el usuario está aprobado
    if (!usuario.aprobado) {
      return res.status(403).json({ mensaje: 'Usuario no aprobado. Por favor, espera la aprobación.' });
    }

    const token = jwt.sign({ id: usuario._id, nombre: usuario.nombre, aprobado: usuario.aprobado }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

module.exports = router;
