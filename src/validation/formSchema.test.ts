import { createFormSchema } from './formSchema';

const countries = ['Georgia', 'Germany'];
const schema = createFormSchema(countries);

const validImage = new File(['x'], 'a.png', { type: 'image/png' });

const validInput = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  gender: 'female',
  country: 'Georgia',
  password: 'Abc1!',
  confirmPassword: 'Abc1!',
  acceptTerms: true,
  image: validImage,
};

const firstError = (data: unknown): string | undefined => {
  const result = schema.safeParse(data);
  return result.success ? undefined : result.error.issues[0]?.message;
};

describe('createFormSchema', () => {
  it('accepts a valid input', () => {
    expect(schema.safeParse(validInput).success).toBe(true);
  });

  it('requires the name to start with an uppercase letter', () => {
    expect(firstError({ ...validInput, name: 'alice' })).toMatch(/uppercase/i);
  });

  it('rejects a negative age', () => {
    expect(firstError({ ...validInput, age: -1 })).toMatch(/negative/i);
  });

  it('rejects an invalid email', () => {
    expect(firstError({ ...validInput, email: 'bad' })).toMatch(/valid email/i);
  });

  it('rejects a country outside the list', () => {
    expect(firstError({ ...validInput, country: 'Narnia' })).toMatch(/country/i);
  });

  it('rejects mismatched passwords', () => {
    expect(
      firstError({ ...validInput, confirmPassword: 'different' })
    ).toMatch(/match/i);
  });

  it('requires the terms to be accepted', () => {
    expect(firstError({ ...validInput, acceptTerms: false })).toMatch(/accept/i);
  });

  it('rejects a non-image file', () => {
    const txt = new File(['x'], 'a.txt', { type: 'text/plain' });
    expect(firstError({ ...validInput, image: txt })).toMatch(/png or jpeg/i);
  });
});
