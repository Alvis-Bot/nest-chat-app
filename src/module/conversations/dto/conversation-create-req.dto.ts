import { StringField } from "../../../common/decorators/field.decorator";


export class ConversationCreateReqDto {

  @StringField()
  username : string;

  @StringField()
  message : string;
}