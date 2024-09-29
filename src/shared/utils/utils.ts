import { AuthenticatedRequest } from '../types';
import { NextFunction, Request } from "express";
import { HttpException, HttpStatus } from '@nestjs/common';
import { ObjectId } from "mongodb";
import * as argon2 from 'argon2';
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

/**
 * Hash data using argon2
 * @param data
 */
export async function hashData(data: string): Promise<string> {
  return await argon2.hash(data);
}

/**
 * Verify hash data
 * @param data
 * @param hash
 */
export async function verifyHash(data: string, hash: string): Promise<boolean> {
  return await argon2.verify(data, hash);
}


