import { applyDecorators, type Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationModel } from '../pagination/offset/pagination.model';

export const ApiPaginatedResponse = <T extends Type<any>>(options: {
  type: T;
  description?: string;
  paginationType?: 'offset' | 'cursor';
}): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(
      options.paginationType === 'offset'
        ? PaginationModel
        : // : CursorPaginatedDto,
          PaginationModel,
      options.type,
    ),
    ApiOkResponse({
      description:
        options.description || `Paginated list of ${options.type.name}`,
      schema: {
        title: `PaginatedResponseOf${options.type.name}`,
        allOf: [
          {
            $ref: getSchemaPath(
              options.paginationType === 'offset'
                ? PaginationModel
                : // : CursorPaginatedDto,
                  PaginationModel,
            ),
          },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        ],
      },
    } as ApiResponseOptions | undefined),
  );
};