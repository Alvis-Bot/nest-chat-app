import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, _metadata: ArgumentMetadata): string {
    // Optional casting into ObjectId if wanted!
    if (ObjectId.isValid(value)) {
      if (String(new ObjectId(value)) === value) return value;
      throw new BadRequestException();
    }
    throw new BadRequestException();
  }
}
