import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from './meta.dto';

export class PaginationModel<TData> {
  @ApiProperty({ type: [Object] })
  @Expose()
  readonly data: TData[];

  @ApiProperty()
  @Expose()
  meta: MetaDto;

  constructor(data: TData[], meta: MetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
