import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { toObjectId } from "../../shared/utils/utils";

export const ObjectIdParam = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const param = request.params[data];

    // Validate if the param is a valid MongoDB ObjectId
    if (!ObjectId.isValid(toObjectId(param))) {
      throw new BadRequestException(`${data} is not a valid ObjectId`);
    }

    // Return the valid ObjectId string
    return param;
  },
);
