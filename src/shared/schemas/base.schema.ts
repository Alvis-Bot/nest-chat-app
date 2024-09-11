import { Transform } from 'class-transformer';

export class BaseSchema {
  @Transform(({ value }) => value.toString())
  _id?: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response
}
