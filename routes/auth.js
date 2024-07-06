const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Usuario = require('../models/usuario');

const JWT_SECRET = 'MaryVillan565250'; 

// Configuración de nodemailer para enviar correos
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu_correo@gmail.com',
    pass: 'tu_contraseña'
  }
});

function enviarCorreoVerificacion(email, token) {
  const mailOptions = {
    from: 'tu_correo@gmail.com',
    to: email,
    subject: 'Verificación de correo',
    text: `Por favor, haz clic en el siguiente enlace para verificar tu cuenta: http://tu_dominio.com/verificar/${token}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
}

function generarTokenVerificacion(email) {
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  return token;
}

// Registro
router.post('/registro', async (req, res) => {
  const { nombre, contrasena, email } = req.body;

  try {
    const usuario = new Usuario({ nombre, contrasena, email });
    await usuario.save();

    const token = generarTokenVerificacion(email);
    enviarCorreoVerificacion(email, token);

    res.status(201).json({ mensaje: 'Usuario registrado. Por favor, verifica tu correo electrónico.' });
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

// Verificación de correo
router.get('/verificar/:token', async (req, res) => {
  const token = req.params.token;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findOne({ email: decoded.email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.verificado = true;
    await usuario.save();

    res.status(200).json({ mensaje: 'Cuenta verificada. Ahora puedes ver los productos.' });
  } catch (err) {
    res.status(400).json({ mensaje: 'Token de verificación inválido o expirado.' });
  }
});

module.exports = router;
