require('dotenv').config(); // Para cargar variables de entorno desde un archivo .env
const cors = require('cors')
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000
const connectDB = require('./config/database');
const authRouter = require('./routes/auth');
const autenticar = require('./middleware/autenticar');
const comidaRoute = require('./routes/comidaRoute');

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Rutas
app.use('/api/comida', comidaRoute); // Ruta para las comidas
app.use('/api/auth', authRouter); // Ruta para autenticación

// Protección de rutas
app.use('/api/protected', autenticar, comidaRoute); // Ruta protegida para comidas

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Aplicación corriendo en el puerto ${port}`);
});
