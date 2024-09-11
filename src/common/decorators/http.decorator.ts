import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common';
import { STATUS_CODES } from 'http';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from './swagger.decorator';
import { ErrorDto } from '../../shared/dto/error.dto';
import { ApiResponseOptions } from "@nestjs/swagger/dist/decorators/api-response.decorator";

type ApiResponseType = number;

interface IApiOptions<T extends Type<any>> {
  type?: T;
  summary?: string;
  description?: string;
  errorResponses?: ApiResponseType[];
  statusCode?: HttpStatus;
  isPaginated?: boolean;
  // paginationType ? : PaginationType;
  // isPublic: boolean;
}

const getDefaultErrorResponses = (): ApiResponseType[] => [
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.NOT_FOUND,
  HttpStatus.UNPROCESSABLE_ENTITY,
  HttpStatus.INTERNAL_SERVER_ERROR,
];

const createErrorResponses = (
  errorResponses: ApiResponseType[] = getDefaultErrorResponses(),
) =>
  errorResponses.map((statusCode) =>
    ApiResponse({
      status: statusCode,
      type: ErrorDto,
      description: STATUS_CODES[statusCode],
    }),
  );

export const ApiEndpoint = (
  options: IApiOptions<Type<any>>,
): MethodDecorator => {
  const {
    type,
    summary,
    description,
    statusCode,
    isPaginated,
    // paginationType,
    errorResponses,
    // auths = ["jwt"],
    // isPublic,
  } = options;

  const okResponse = isPaginated
    ? {
        type,
        description: description ?? 'OK',
      }
    : {
        isArray: true,
        type,
        description: description ?? 'OK',
      };

  // const authDecorators = (auths).map(auth => {
  //   switch (auth) {
  //     case "basic":
  //       return ApiBasicAuth();
  //     case "api-key":
  //       return ApiSecurity("Api-Key");
  //     case "jwt":
  //     default:
  //       return ApiBearerAuth();
  //   }
  // });

  const decorators = [
    ApiOperation({ summary }),

    HttpCode(statusCode || HttpStatus.OK),
    isPaginated
      ? ApiPaginatedResponse(okResponse)
      : statusCode === HttpStatus.CREATED
        ? ApiCreatedResponse(okResponse)
        : ApiOkResponse(okResponse),
    ...createErrorResponses(errorResponses),
    // ...(isPublic ? [Public()] : [UseGuards(AuthGuard('jwt'))]),
  ];

  return applyDecorators(...decorators);
};
