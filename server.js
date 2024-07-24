const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/url', require('./routes/url'));

// Puerto del servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
