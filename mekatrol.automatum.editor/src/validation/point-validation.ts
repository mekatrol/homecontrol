import type { Point } from '@/services/api-generated';
import { validateUuid, type ValidationResult } from './validation-helpers';

export const validatePoint = (point: Point): ValidationResult[] => {
  const validationResults: ValidationResult[] = [];

  if (!point.name || point.name.trim().length === 0) {
    validationResults.push({
      field: 'name',
      message: 'Name is required'
    });
  }

  if (!point.key || point.key.trim().length === 0) {
    validationResults.push({
      field: 'key',
      message: 'Key is required'
    });
  }

  if (!validateUuid(point.id)) {
    validationResults.push({
      field: 'id',
      message: 'The id is not a valid UUID'
    });
  }

  return validationResults;
};
