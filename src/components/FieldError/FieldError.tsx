import styles from './FieldError.module.css';

interface FieldErrorProps {
  message?: string;
}

function FieldError({ message }: FieldErrorProps) {
  return (
    <p className={styles.error} role={message ? 'alert' : undefined}>
      {message ?? ''}
    </p>
  );
}

export default FieldError;
