import { StringField } from "../../../common/decorators/field.decorator";


export class FriendCreateDto{

  @StringField()
  username: string;

  @StringField()
  description: string;
}