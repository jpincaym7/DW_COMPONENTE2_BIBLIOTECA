import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginSchema } from '@biblioteca/shared';

import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormField } from '../../components/ui/FormField.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useForm } from '../../hooks/useForm.js';
import { PATHS } from '../../routes/paths.js';
import { getFieldErrors } from '../../utils/errorMessage.js';
import styles from '../../styles/features/auth/AuthForm.module.css';

const INITIAL_VALUES = { email: '', password: '' };

export const LoginForm = ({ onLogin }) => {
  const [globalError, setGlobalError] = useState(null);

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, setErrors } = useForm({
    initialValues: INITIAL_VALUES,
    schema: loginSchema,
    onSubmit: async (data) => {
      setGlobalError(null);

      try {
        await onLogin(data);
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

      <FormField label="Correo electronico" name="email" error={errors.email} required>
        {(fieldProps) => (
          <Input
            {...fieldProps}
            type="email"
            autoComplete="email"
            placeholder="usuario@biblioteca.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
      </FormField>

      <FormField label="Contrasena" name="password" error={errors.password} required>
        {(fieldProps) => (
          <Input
            {...fieldProps}
            type="password"
            autoComplete="current-password"
            placeholder="Ingrese su contrasena"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
      </FormField>

      <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
        Iniciar sesion
      </Button>

      <p className={styles.footer}>
        No tiene una cuenta?{' '}
        <Link to={PATHS.REGISTER} className={styles.link}>
          Registrese aqui
        </Link>
      </p>
    </form>
  );
};
