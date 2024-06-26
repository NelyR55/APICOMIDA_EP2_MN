const express = require ("express")
const morgan = require ("morgan")
const app = express()
const port = 3500
const connectDB = require('./config/database');

const comidaRoute = require('./routes/comidaRoute')

connectDB();

app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use(morgan('dev'))

app.use('/api', comidaRoute)

app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

app.listen(port,()=> {
    console.log(`Aplicacion corriendo por el puerto ${port}`)
})


