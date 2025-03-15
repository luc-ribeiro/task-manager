import dotenv from 'dotenv';
import app from './app.ts';
import { initDatabase } from '../db/database.ts';

dotenv.config();

const PORT = process.env.APP_PORT || 9000;

const startServer = async (): Promise<void> => {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer(); 