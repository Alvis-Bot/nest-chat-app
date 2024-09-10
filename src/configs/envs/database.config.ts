import { IsString, ValidateIf } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { validateConfig } from '../../shared/utils/validate-config';
import { DatabaseConfig } from '../../shared/types';

class EnvironmentVariables {
  @ValidateIf((envValues) => envValues.MONGO_URI)
  @IsString()
  MONGO_URI: string;
}

export default registerAs<DatabaseConfig>('database', (): DatabaseConfig => {
  console.info(`Register DatabaseConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariables);

  return {
    mongo_uri: process.env.MONGO_URI,
  };
});
