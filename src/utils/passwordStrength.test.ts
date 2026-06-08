import { getPasswordStrength } from './passwordStrength';

describe('getPasswordStrength', () => {
  it('reports nothing for an empty password', () => {
    const result = getPasswordStrength('');
    expect(result.hasNumber).toBe(false);
    expect(result.hasUppercase).toBe(false);
    expect(result.hasLowercase).toBe(false);
    expect(result.hasSpecial).toBe(false);
    expect(result.score).toBe(0);
    expect(result.label).toBe('weak');
  });

  it('detects a single criterion', () => {
    const result = getPasswordStrength('abc');
    expect(result.hasLowercase).toBe(true);
    expect(result.hasUppercase).toBe(false);
    expect(result.score).toBe(1);
    expect(result.label).toBe('weak');
  });

  it('detects all four criteria as strong', () => {
    const result = getPasswordStrength('Abc1!');
    expect(result.hasNumber).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasSpecial).toBe(true);
    expect(result.score).toBe(4);
    expect(result.label).toBe('strong');
  });

  it('reports medium for two or three criteria', () => {
    expect(getPasswordStrength('Ab1').label).toBe('medium');
  });
});
