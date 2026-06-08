import { fileToBase64 } from './fileToBase64';

describe('fileToBase64', () => {
  it('converts a file to a base64 data URL', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const result = await fileToBase64(file);
    expect(result).toBe('data:image/png;base64,aGVsbG8=');
  });
});
