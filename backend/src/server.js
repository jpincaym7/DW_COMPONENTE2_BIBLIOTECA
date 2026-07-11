import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    const host = await connectDatabase();
    process.stdout.write(`Base de datos conectada en ${host}\n`);

    app.listen(env.port, () => {
      process.stdout.write(`Servidor escuchando en el puerto ${env.port}\n`);
    });
  } catch (error) {
    process.stderr.write(`No fue posible iniciar el servidor: ${error.message}\n`);
    process.exit(1);
  }
};

startServer();
