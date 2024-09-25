import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { registerAs } from '@nestjs/config';
import { Environment } from '../../shared/constants/app.constant';
import { AppConfig } from '../../shared/types';
import { validateConfig } from '../../shared/utils/validate-config';

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsOptional()
  APP_NAME: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  APP_URL: string;

  @IsInt()
  @Min(3000)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsBoolean()
  @IsOptional()
  APP_DEBUG: boolean;

  @IsString()
  FIREBASE_SDK_PATH: string;

  @IsString()
  @Matches(
    /^(true|false|\*|([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)?(,([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)*$/,
  )
  @IsOptional()
  APP_CORS_ORIGIN: string;
}

export default registerAs<AppConfig>('app', (): AppConfig => {
  console.info(`Register AppConfig from environment variables`);

  validateConfig(process.env, EnvironmentVariables);

  return {
    node_env: process.env.NODE_ENV,
    name: process.env.APP_NAME,
    url: process.env.APP_URL,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    api_prefix: process.env.API_PREFIX || 'api',
    debug: process.env.APP_DEBUG === 'true',
    cors_origin: getCorsOrigin(),
    log_level: process.env.APP_LOG_LEVEL || 'warn',
    firebase_sdk_path: process.env.FIREBASE_SDK_PATH,
  };
});

function getCorsOrigin() {
  const corsOrigin = process.env.APP_CORS_ORIGIN;
  if (corsOrigin === 'true') return true;
  if (corsOrigin === '*') return '*';
  if (!corsOrigin || corsOrigin === 'false') return false;

  return corsOrigin.split(',').map((origin) => origin.trim());
}
