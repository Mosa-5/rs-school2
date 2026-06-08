import { isValidEmail } from './email';

describe('isValidEmail', () => {
  it('accepts a basic valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('a.b@sub.domain.org')).toBe(true);
  });

  it('rejects emails without exactly one @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
    expect(isValidEmail('user@@example.com')).toBe(false);
    expect(isValidEmail('a@b@example.com')).toBe(false);
  });

  it('rejects an empty local part', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('rejects a domain without a dot', () => {
    expect(isValidEmail('user@example')).toBe(false);
  });

  it('rejects a domain with empty labels', () => {
    expect(isValidEmail('user@example.')).toBe(false);
    expect(isValidEmail('user@.com')).toBe(false);
  });
});
