import { AuthenticatedRequest } from '../types';
import { NextFunction, Request } from "express";
import { HttpException, HttpStatus } from '@nestjs/common';
import { ObjectId } from "mongodb";

export function isAuthorized(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  console.log('isAuthorized');
  if (req.user) next();
  else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
}

// cover string to objectId
export function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

// so sánh 2 ObjectId
export function compareObjectId(id1: ObjectId, id2: ObjectId): boolean {
  return id1.equals(id2);
}



