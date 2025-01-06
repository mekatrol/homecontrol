import type { Flow } from '@/services/api-generated';
import { validateInterval, validateUuid, type ValidationResult } from './validation-helpers';

export const validateFlow = (flow: Flow): ValidationResult[] => {
  const validationResults: ValidationResult[] = [];

  if (!flow.name || flow.name.trim().length === 0) {
    validationResults.push({
      field: 'name',
      message: 'Name is required'
    });
  }

  if (!validateUuid(flow.id)) {
    validationResults.push({
      field: 'id',
      message: 'The id is not a valid UUID'
    });
  }

  if (!validateInterval(flow.interval)) {
    validationResults.push({
      field: 'interval',
      message: 'The interval is not valid'
    });
  }

  return validationResults;
};
