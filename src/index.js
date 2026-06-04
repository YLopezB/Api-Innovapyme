import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';
dotenvExpand.expand(dotenv.config());

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
