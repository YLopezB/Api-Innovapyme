import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger/swagger.js';
import routerIndex from './routes/index.js';
import handlerError from './middlewares/handlerError.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Swagger config
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas API
app.use('/api', routerIndex);

// Handler de error
app.use(handlerError);

export default app;
