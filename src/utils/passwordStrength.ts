export type PasswordStrengthLabel = 'weak' | 'medium' | 'strong';

export interface PasswordStrength {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecial: boolean;
  score: number;
  label: PasswordStrengthLabel;
}

const SPECIAL_CHARACTERS = '!@#$%^&*()_+-=[]{};:\'",.<>/?\\|`~';

function isUppercaseLetter(char: string): boolean {
  return char !== char.toLowerCase() && char === char.toUpperCase();
}

function isLowercaseLetter(char: string): boolean {
  return char !== char.toUpperCase() && char === char.toLowerCase();
}

export function getPasswordStrength(password: string): PasswordStrength {
  const chars = [...password];

  const hasNumber = chars.some((char) => char >= '0' && char <= '9');
  const hasUppercase = chars.some(isUppercaseLetter);
  const hasLowercase = chars.some(isLowercaseLetter);
  const hasSpecial = chars.some((char) => SPECIAL_CHARACTERS.includes(char));

  const score = [hasNumber, hasUppercase, hasLowercase, hasSpecial].filter(
    Boolean
  ).length;

  const label: PasswordStrengthLabel =
    score <= 1 ? 'weak' : score <= 3 ? 'medium' : 'strong';

  return { hasNumber, hasUppercase, hasLowercase, hasSpecial, score, label };
}
