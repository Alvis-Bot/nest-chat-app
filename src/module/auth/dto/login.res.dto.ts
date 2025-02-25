import {
  PasswordField,
  StringField, StringFieldOptional
} from "../../../common/decorators/field.decorator";

export class LoginResDto {
  @StringField({
    default: 'admin',
    minLength: 4,
  })
  username: string;

  @PasswordField({
    default: '123456',
  })
  password: string;

  @StringFieldOptional()
  fcmToken?: string;
}
