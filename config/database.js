const mongoose = require('mongoose');

// Cargar las variables de entorno desde un archivo .env


// Función de conexión a la base de datos
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);

        // Conectar a la base de datos usando la URL de conexión de Railway
        await mongoose.connect('mongodb://mongo:YVZvPGbbrsjHZnQRfyQBWfEgJhAGbfyV@monorail.proxy.rlwy.net:52173');
        console.log("Conexión correcta");
    } catch (error) {
        console.error("Error en la conexión", error);
    }
};

module.exports = connectDB;