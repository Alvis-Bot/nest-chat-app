import {
  PasswordField,
  StringField,
} from '../../../common/decorators/field.decorator';

export class RegisterResDto {
  @StringField({
    default: 'admin',
    minLength: 4,
  })
  username: string;

  @PasswordField({
    default: '123456',
  })
  password: string;

  @StringField()
  full_name: string;
}
