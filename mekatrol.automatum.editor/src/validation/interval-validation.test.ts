import { describe, expect, it } from 'vitest';
import { validateInterval } from './validation-helpers';

describe('validateInterval', () => {
  it('undefined string', () => {
    expect(validateInterval('')).toBe(false);
  });

  it('invalid string', () => {
    expect(validateInterval('00:00:0a')).toBe(false);
    expect(validateInterval('00:0a:00')).toBe(false);
    expect(validateInterval('0a:00:00')).toBe(false);
    expect(validateInterval('a.00:00:00')).toBe(false);
  });

  it('valid string', () => {
    expect(validateInterval('00:00:00')).toBe(true);
    expect(validateInterval('00:00:00')).toBe(true);
    expect(validateInterval('00:00:00')).toBe(true);
    expect(validateInterval('1.00:00:00')).toBe(true);
    expect(validateInterval('.00:00:00')).toBe(true);

    expect(validateInterval('23:59:59')).toBe(true);
    expect(validateInterval('00:00:59')).toBe(true);
    expect(validateInterval('00:59:00')).toBe(true);
    expect(validateInterval('0.23:00:00')).toBe(true);
    expect(validateInterval('1.00:00:00')).toBe(true);
  });

  it('out of range string', () => {
    expect(validateInterval('00:00:60')).toBe(false);
    expect(validateInterval('00:60:00')).toBe(false);
    expect(validateInterval('24:00:00')).toBe(false);
    expect(validateInterval('1.24:00:00')).toBe(false);
    expect(validateInterval('.00:70:00')).toBe(false);
  });
});
