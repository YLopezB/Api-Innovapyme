import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3000;

const ready = () => console.log(`Servidor corriendo en el puerto ${PORT}`);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.listen(PORT, ready);
