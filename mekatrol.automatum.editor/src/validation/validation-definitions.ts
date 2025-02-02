import { EMPTY_GUID } from '@/constants';
import type { ValidationModel } from '@/validation/validation-model';

export const validations = {
  flow: {
    id: {
      minLength: EMPTY_GUID.length,
      maxLength: EMPTY_GUID.length,
      required: true
    } as ValidationModel,
    key: {
      minLength: 1,
      maxLength: 200,
      required: true
    } as ValidationModel,
    interval: {
      minLength: 8,
      maxLength: 8,
      required: true
    } as ValidationModel,
    name: {
      minLength: 5,
      maxLength: 100,
      required: true
    } as ValidationModel,
    description: {
      maxLength: 500,
      required: false
    } as ValidationModel
  },
  point: {
    id: {
      minLength: EMPTY_GUID.length,
      maxLength: EMPTY_GUID.length,
      required: true
    } as ValidationModel,
    key: {
      minLength: 1,
      maxLength: 200,
      required: true
    } as ValidationModel,
    name: {
      minLength: 5,
      maxLength: 100,
      required: true
    } as ValidationModel,
    description: {
      maxLength: 500,
      required: false
    } as ValidationModel
  }
};
