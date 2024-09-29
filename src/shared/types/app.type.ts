import { DatabaseConfig } from './database.type';
import { User } from '../../module/users/schemas/user.schema';

export type AppConfig = {
  port: number;
  name: string;
  url: string;
  node_env: string;
  api_prefix: string;
  debug: boolean;
  cors_origin: boolean | string | string[];
  log_level: string;
};

export type AllConfigType = {
  database: DatabaseConfig;
  app: AppConfig;
};



