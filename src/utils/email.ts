export function isValidEmail(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const parts = value.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;
  if (localPart.length === 0 || domain.length === 0) {
    return false;
  }

  if (!domain.includes('.')) {
    return false;
  }

  const labels = domain.split('.');
  return labels.every((label) => label.length > 0);
}
