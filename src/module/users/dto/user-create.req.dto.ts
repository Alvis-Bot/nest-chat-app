import {
  PhoneField,
  StringField,
} from '../../../common/decorators/field.decorator';

export class UserCreateReqDto {
  @StringField()
  full_name: string;

  @PhoneField('VN')
  phone_number: string;
}
