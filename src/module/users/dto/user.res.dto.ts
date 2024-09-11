import {
  PhoneField,
  StringField,
} from '../../../common/decorators/field.decorator';
import { BaseDto } from '../../../shared/dto/base.dto';

export class UserResDto extends BaseDto {
  @StringField()
  full_name: string;

  @PhoneField({
    countryCode: 'VN',
  })
  phone_number: string;
}
