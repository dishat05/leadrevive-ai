import { Model, Types } from 'mongoose';
import { AppError } from './apiResponse.js';

export async function assertOwnership<T extends { userId: Types.ObjectId }>(
  ModelClass: Model<T>,
  resourceId: string,
  userId: string,
  extraFilter: Record<string, unknown> = {}
): Promise<T> {
  if (!Types.ObjectId.isValid(resourceId)) {
    throw new AppError(404, 'NOT_FOUND', 'Resource not found');
  }

  const doc = await ModelClass.findOne({
    _id: new Types.ObjectId(resourceId),
    userId: new Types.ObjectId(userId),
    ...extraFilter,
  });

  if (!doc) {
    throw new AppError(404, 'NOT_FOUND', 'Resource not found');
  }

  return doc;
}
