import type { InputOutput } from '@/services/api-generated';
import type { Size } from './Size';

export interface BlockTemplate {
  // The function type, must be unique across all function configurations,
  // convention is upper case eg 'AND3' (for a 3 input And gate)
  type: string;

  // A friendly name for the function type, eg 'AND 3' for a 3 input and gate.
  label: string;

  // Describe the gat function, eg 'A 3 input AND gate'.
  description: string;

  // Defines the inputs/outputs for the function
  io: InputOutput[];

  // Defines the visual size
  size: Size;
}
