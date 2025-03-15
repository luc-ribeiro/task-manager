import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbPort = process.env.NODE_ENV === 'production' ? process.env.DB_PORT : process.env.DB_LOCAL_PORT;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'task_manager',
  port: parseInt(dbPort || '3306')
});

export const query = async <T>(sql: string, params?: unknown[]): Promise<T> => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error) {
    console.error('Erro ao executar query:', error);
    throw error;
  }
};

export const initDatabase = async (): Promise<void> => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        status ENUM('pendente', 'em andamento', 'concluída') NOT NULL DEFAULT 'pendente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

export default {
  query,
  initDatabase,
  pool
}; 