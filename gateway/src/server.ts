import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Gateway escuchando en puerto ${PORT}`);
});
