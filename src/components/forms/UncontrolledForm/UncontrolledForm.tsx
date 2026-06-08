import { useState, type SyntheticEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addSubmission } from '../../../store/submissionsSlice';
import { createFormSchema, GENDER_OPTIONS } from '../../../validation/formSchema';
import { fileToBase64 } from '../../../utils/fileToBase64';
import FieldError from '../../FieldError/FieldError';
import PasswordStrengthMeter from '../../PasswordStrengthMeter/PasswordStrengthMeter';
import styles from '../formStyles.module.css';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

const COUNTRY_LIST_ID = 'uncontrolled-country-list';

function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.countries.items);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const imageEntry = formData.get('image');

    const raw = {
      name: String(formData.get('name') ?? ''),
      age: String(formData.get('age') ?? ''),
      email: String(formData.get('email') ?? ''),
      gender: String(formData.get('gender') ?? ''),
      country: String(formData.get('country') ?? ''),
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      acceptTerms: formData.get('acceptTerms') === 'on',
      image: imageEntry instanceof File ? imageEntry : undefined,
    };

    const result = createFormSchema(countries).safeParse(raw);

    if (!result.success) {
      const mapped: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? '');
        if (key && !mapped[key]) {
          mapped[key] = issue.message;
        }
      }
      setErrors(mapped);
      return;
    }

    setErrors({});
    const image = await fileToBase64(result.data.image);
    dispatch(
      addSubmission({
        name: result.data.name,
        age: result.data.age,
        email: result.data.email,
        gender: result.data.gender,
        country: result.data.country,
        acceptTerms: result.data.acceptTerms,
        image,
      })
    );
    onSuccess();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="uc-name">Name</label>
        <input id="uc-name" name="name" type="text" />
        <FieldError message={errors.name} />
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-age">Age</label>
        <input id="uc-age" name="age" type="number" min="0" />
        <FieldError message={errors.age} />
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-email">Email</label>
        <input id="uc-email" name="email" type="email" />
        <FieldError message={errors.email} />
      </div>

      <fieldset className={styles.field}>
        <legend>Gender</legend>
        <div className={styles.radioGroup}>
          {GENDER_OPTIONS.map((option) => (
            <label key={option} className={styles.radioOption} htmlFor={`uc-gender-${option}`}>
              <input
                id={`uc-gender-${option}`}
                name="gender"
                type="radio"
                value={option}
              />
              {option}
            </label>
          ))}
        </div>
        <FieldError message={errors.gender} />
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="uc-country">Country</label>
        <input id="uc-country" name="country" type="text" list={COUNTRY_LIST_ID} />
        <datalist id={COUNTRY_LIST_ID}>
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        <FieldError message={errors.country} />
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-password">Password</label>
        <input
          id="uc-password"
          name="password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrengthMeter password={password} />
        <FieldError message={errors.password} />
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-confirm-password">Confirm password</label>
        <input
          id="uc-confirm-password"
          name="confirmPassword"
          type="password"
        />
        <FieldError message={errors.confirmPassword} />
      </div>

      <div className={styles.field}>
        <label htmlFor="uc-image">Profile image (PNG or JPEG)</label>
        <input id="uc-image" name="image" type="file" accept="image/png,image/jpeg" />
        <FieldError message={errors.image} />
      </div>

      <div className={`${styles.field} ${styles.checkboxField}`}>
        <input id="uc-terms" name="acceptTerms" type="checkbox" />
        <label htmlFor="uc-terms">I accept the Terms and Conditions</label>
      </div>
      <FieldError message={errors.acceptTerms} />

      <button type="submit" className={styles.submit}>
        Submit
      </button>
    </form>
  );
}

export default UncontrolledForm;
