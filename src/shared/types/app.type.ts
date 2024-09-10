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
