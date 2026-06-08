import { useMemo } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addSubmission } from '../../../store/submissionsSlice';
import { createFormSchema, GENDER_OPTIONS } from '../../../validation/formSchema';
import { fileToBase64 } from '../../../utils/fileToBase64';
import FieldError from '../../FieldError/FieldError';
import PasswordStrengthMeter from '../../PasswordStrengthMeter/PasswordStrengthMeter';
import styles from '../formStyles.module.css';

interface RhfFormProps {
  onSuccess: () => void;
}

const COUNTRY_LIST_ID = 'rhf-country-list';

function RhfForm({ onSuccess }: RhfFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.countries.items);
  const schema = useMemo(() => createFormSchema(countries), [countries]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      country: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = useWatch({ control, name: 'password' }) ?? '';

  const onValid = handleSubmit(async (values) => {
    const image = await fileToBase64(values.image);
    dispatch(
      addSubmission({
        name: values.name,
        age: values.age,
        email: values.email,
        gender: values.gender,
        country: values.country,
        acceptTerms: values.acceptTerms,
        image,
      })
    );
    onSuccess();
  });

  return (
    <form className={styles.form} onSubmit={onValid} noValidate>
      <div className={styles.field}>
        <label htmlFor="rhf-name">Name</label>
        <input id="rhf-name" type="text" {...register('name')} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-age">Age</label>
        <input
          id="rhf-age"
          type="number"
          min="0"
          {...register('age', { valueAsNumber: true })}
        />
        <FieldError message={errors.age?.message} />
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-email">Email</label>
        <input id="rhf-email" type="email" {...register('email')} />
        <FieldError message={errors.email?.message} />
      </div>

      <fieldset className={styles.field}>
        <legend>Gender</legend>
        <div className={styles.radioGroup}>
          {GENDER_OPTIONS.map((option) => (
            <label
              key={option}
              className={styles.radioOption}
              htmlFor={`rhf-gender-${option}`}
            >
              <input
                id={`rhf-gender-${option}`}
                type="radio"
                value={option}
                {...register('gender')}
              />
              {option}
            </label>
          ))}
        </div>
        <FieldError message={errors.gender?.message} />
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="rhf-country">Country</label>
        <input
          id="rhf-country"
          type="text"
          list={COUNTRY_LIST_ID}
          {...register('country')}
        />
        <datalist id={COUNTRY_LIST_ID}>
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        <FieldError message={errors.country?.message} />
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-password">Password</label>
        <input
          id="rhf-password"
          type="password"
          {...register('password')}
        />
        <PasswordStrengthMeter password={password} />
        <FieldError message={errors.password?.message} />
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-confirm-password">Confirm password</label>
        <input
          id="rhf-confirm-password"
          type="password"
          {...register('confirmPassword')}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      <div className={styles.field}>
        <label htmlFor="rhf-image">Profile image (PNG or JPEG)</label>
        <Controller
          control={control}
          name="image"
          render={({ field: { onChange, ref, name } }) => (
            <input
              id="rhf-image"
              ref={ref}
              name={name}
              type="file"
              accept="image/png,image/jpeg"
              onChange={(event) => onChange(event.target.files?.[0])}
            />
          )}
        />
        <FieldError message={errors.image?.message} />
      </div>

      <div className={`${styles.field} ${styles.checkboxField}`}>
        <input id="rhf-terms" type="checkbox" {...register('acceptTerms')} />
        <label htmlFor="rhf-terms">I accept the Terms and Conditions</label>
      </div>
      <FieldError message={errors.acceptTerms?.message} />

      <button type="submit" className={styles.submit} disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}

export default RhfForm;
