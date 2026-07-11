import { useState } from 'react';
import { createAuthorSchema } from '@biblioteca/shared';

import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormField } from '../../components/ui/FormField.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useForm } from '../../hooks/useForm.js';
import { getFieldErrors } from '../../utils/errorMessage.js';
import styles from '../../styles/features/shared/FormLayout.module.css';

export const EMPTY_AUTHOR = { name: '', nationality: '', birthYear: '' };

export const AuthorForm = ({ initialValues, submitLabel, onSubmit, onCancel }) => {
  const [globalError, setGlobalError] = useState(null);

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, setErrors } = useForm({
    initialValues,
    schema: createAuthorSchema,
    onSubmit: async (data) => {
      setGlobalError(null);

      try {
        await onSubmit(data);
      } catch (apiError) {
        const fieldErrors = getFieldErrors(apiError.errors);

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          setGlobalError(apiError.message);
        }
      }
    }
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {globalError ? <Alert variant="danger">{globalError}</Alert> : null}

      <FormField label="Nombre" name="name" error={errors.name} required>
        {(fieldProps) => (
          <Input
            {...fieldProps}
            placeholder="Nombre completo del autor"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
      </FormField>

      <div className={styles.grid}>
        <FormField label="Nacionalidad" name="nationality" error={errors.nationality}>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              placeholder="Ecuatoriana"
              value={values.nationality}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}
        </FormField>

        <FormField label="Anio de nacimiento" name="birthYear" error={errors.birthYear}>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              type="number"
              placeholder="1927"
              value={values.birthYear}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}
        </FormField>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
