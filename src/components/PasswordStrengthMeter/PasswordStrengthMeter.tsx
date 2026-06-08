import { getPasswordStrength } from '../../utils/passwordStrength';
import styles from './PasswordStrengthMeter.module.css';

interface PasswordStrengthMeterProps {
  password: string;
}

const CRITERIA = [
  { key: 'hasNumber', label: 'At least 1 number' },
  { key: 'hasUppercase', label: 'At least 1 uppercase letter' },
  { key: 'hasLowercase', label: 'At least 1 lowercase letter' },
  { key: 'hasSpecial', label: 'At least 1 special character' },
] as const;

function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = getPasswordStrength(password);

  return (
    <div className={styles.meter}>
      <p className={styles.label}>
        Strength: <span data-strength={strength.label}>{strength.label}</span>
      </p>
      <ul className={styles.list}>
        {CRITERIA.map((criterion) => (
          <li
            key={criterion.key}
            className={strength[criterion.key] ? styles.met : styles.unmet}
          >
            {strength[criterion.key] ? '✓' : '○'} {criterion.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PasswordStrengthMeter;
