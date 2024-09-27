import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class BaseSchema {
  @Transform(({ value }) => value.toString())
  _id?: Types.ObjectId; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response
}
