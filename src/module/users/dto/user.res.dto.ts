import {
  PhoneField,
  StringField,
} from '../../../common/decorators/field.decorator';
import { BaseDto } from '../../../shared/dto/base.dto';

export class UserResDto extends BaseDto {
  @StringField()
  full_name: string;

  @PhoneField('VN')
  phone_number: string;
}
