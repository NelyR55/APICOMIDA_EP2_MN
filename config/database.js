const mongoose = require('mongoose');
require('dotenv').config(); // Para cargar variables de entorno desde un archivo .env

// Función para conectar a MongoDB
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        const URL = `mongodb+srv://2036000531:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@cluster0.lgnuerl.mongodb.net/ApiComida?retryWrites=true&w=majority&appName=Cluster0`;
        
        await mongoose.connect(URL);
        
        console.log("Conexión correcta");
    } catch (error) {
        console.error("Error en la conexión", error);
    }
}

module.exports = connectDB;
