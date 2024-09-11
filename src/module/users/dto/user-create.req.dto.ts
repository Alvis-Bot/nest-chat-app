import {
  PhoneField,
  StringField,
} from '../../../common/decorators/field.decorator';

export class UserCreateReqDto {
  @StringField()
  full_name: string;

  @PhoneField({
    countryCode: 'VN',
  })
  phone_number: string;
}
