import { FilterQuery, Model, SortOrder } from 'mongoose';
import { PaginationDto } from './offset/pagination.dto';
import { PaginationModel } from './offset/pagination.model';
import { MetaDto } from './offset/meta.dto';

type SortType =
  | string
  | { [key: string]: SortOrder | { $meta: any } }
  | [string, SortOrder][];

export async function buildPagination<T>(
  model: Model<T>,
  options: PaginationDto = new PaginationDto(),
  q?: FilterQuery<T>,
  sort?: SortType,
): Promise<PaginationModel<T>> {
  const [data, itemCount] = await Promise.all([
    model
      .find({ ...q })
      .skip(options.skip)
      .limit(options.take)
      .sort(sort)
      .exec(),
    model.countDocuments().exec(),
  ]);
  const meta = new MetaDto(itemCount, options);
  return new PaginationModel(data, meta);
}
