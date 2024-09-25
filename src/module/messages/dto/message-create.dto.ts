import { StringField } from '../../../common/decorators/field.decorator';
import { ApiProperty } from "@nestjs/swagger";

export class MessageCreateDto {
  @StringField()
  content: string;
}
