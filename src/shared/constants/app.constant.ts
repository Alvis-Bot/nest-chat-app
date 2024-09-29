export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export const IS_PUBLIC_KEY = 'isPublic';

export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_CURRENT_PAGE = 1;


export const REDIS = Symbol('AUTH:REDIS');