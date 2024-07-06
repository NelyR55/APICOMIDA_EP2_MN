require('dotenv').config(); // Para cargar variables de entorno desde un archivo .env
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require('./config/database');
const authRouter = require('./routes/auth');
const comidaRoute = require('./routes/comidaRoute');
const autenticar = require('./middleware/autenticar');
const verificarSolicitud = require('./middleware/verificarSolicitud');

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Rutas
app.use('/api', comidaRoute); // Ruta para las comidas
app.use('/api', authRouter); // Ruta para autenticación

// Ruta protegida para comidas
app.use('/api/protected', autenticar, comidaRoute); 

// Ruta para verificar el estado de la solicitud de registro
app.use('/api/verificar-solicitud', verificarSolicitud, comidaRoute);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Aplicación corriendo en el puerto ${port}`);
});
