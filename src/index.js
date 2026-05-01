import express from 'express';
import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';
dotenvExpand.expand(dotenv.config());
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger/swagger.js';
import routerIndex from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

const ready = () => console.log(`Servidor corriendo en el puerto ${PORT}`);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//Swagger config
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', routerIndex);

//Rutas

app.listen(PORT, ready);
