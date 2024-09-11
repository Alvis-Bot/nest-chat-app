import { DateField, UUIDField } from '../../common/decorators/field.decorator';

export class BaseDto {
  @UUIDField()
  _id: string;

  @DateField()
  created_at: Date;

  @DateField()
  updated_at: Date;
}
