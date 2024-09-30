import { IsString, ValidateIf } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { validateConfig } from '../../shared/utils/validate-config';
import { DatabaseConfig } from '../../shared/types';

class EnvironmentVariables {
  @ValidateIf((envValues) => envValues.MONGO_URI)
  @IsString()
  MONGO_URI: string;

  @ValidateIf((envValues) => envValues.REDIS_HOST)
  @IsString()
  REDIS_HOST: string;

  @ValidateIf((envValues) => envValues.REDIS_PORT)
  @IsString()
  REDIS_PORT: string;
}

export default registerAs<DatabaseConfig>('database', (): DatabaseConfig => {
  console.info(`Register DatabaseConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariables);

  return {
    mongo_uri: process.env.MONGO_URI,
    redis_host: process.env.REDIS_HOST,
    redis_port: parseInt(process.env.REDIS_PORT),
    redis_url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  };
});
