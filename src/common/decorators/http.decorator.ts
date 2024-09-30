import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  Type,
  UseGuards,
} from '@nestjs/common';
import { STATUS_CODES } from 'http';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse
} from "@nestjs/swagger";
import { ApiPaginatedResponse } from './swagger.decorator';
import { ErrorDto } from '../../shared/dto/error.dto';
import { Public } from './public.decorator';
import { AuthenticatedGuard } from "../../module/auth/guards/authenticated.guard";

type ApiResponseType = number;

interface IApiOptions<T extends Type<any>> {
  type?: T
  summary?: string;
  description?: string;
  errorResponses?: ApiResponseType[];
  statusCode?: HttpStatus;
  isPaginated?: boolean;
  // paginationType ? : PaginationType;
  isPublic?: boolean;
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
  options: IApiOptions<Type> = {},  // Default value to an empty object
): MethodDecorator => {
  const {
    type,
    summary,
    description,
    statusCode,
    isPaginated,
    errorResponses,
    isPublic = false,
  } = options || {}; // Destructure options with fallback to an empty object

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

  const decorators = [
    ApiOperation({ summary }),
    HttpCode(statusCode || HttpStatus.OK),
    isPaginated
      ? ApiPaginatedResponse(okResponse)
      : statusCode === HttpStatus.CREATED
        ? ApiCreatedResponse(okResponse)
        : ApiOkResponse(okResponse),
    ...createErrorResponses(errorResponses),
    ...(isPublic ? [Public()] : [UseGuards(AuthenticatedGuard), ApiBearerAuth()]),
  ];

  return applyDecorators(...decorators);
};
