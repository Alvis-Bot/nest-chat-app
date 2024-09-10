import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validateConfig = <T extends object>(
  config: Record<string, unknown>,
  targetClass: ClassConstructor<T>,
): T => {
  const validatedConfig = plainToInstance(targetClass, config, {
    enableImplicitConversion: true, // This is required to convert string to number
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false, // This is required to validate missing properties
  });

  if (errors.length > 0) {
    const errorMsg = errors
      .map(
        (error) =>
          `\nError in ${error.property}:\n` +
          Object.entries(error.constraints)
            .map(([key, value]) => `+ ${key}: ${value}`)
            .join('\n'),
      )
      .join('\n');

    console.error(`\n${errors.toString()}`);
    throw new Error(errorMsg);
  }
  return validatedConfig;
};
