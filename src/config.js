import { config } from 'dotenv';

config();

export const { PORT, TOKEN_KEY, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } =
  process.env;
