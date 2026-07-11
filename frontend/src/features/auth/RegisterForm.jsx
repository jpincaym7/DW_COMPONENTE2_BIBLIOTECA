import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PASSWORD_MIN_LENGTH, registerSchema } from '@biblioteca/shared';

import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormField } from '../../components/ui/FormField.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useForm } from '../../hooks/useForm.js';
import { PATHS } from '../../routes/paths.js';
import { getFieldErrors } from '../../utils/errorMessage.js';
import styles from '../../styles/features/auth/AuthForm.module.css';

const INITIAL_VALUES = { name: '', email: '', password: '' };

export const RegisterForm = ({ onRegister }) => {
  const [globalError, setGlobalError] = useState(null);

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, setErrors } = useForm({
    initialValues: INITIAL_VALUES,
    schema: registerSchema,
    onSubmit: async (data) => {
      setGlobalError(null);

      try {
        await onRegister(data);
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

      <FormField label="Nombre completo" name="name" error={errors.name} required>
        {(fieldProps) => (
          <Input
            {...fieldProps}
            autoComplete="name"
            placeholder="Nombre y apellido"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
      </FormField>

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

      <FormField
        label="Contrasena"
        name="password"
        error={errors.password}
        hint={`Minimo ${PASSWORD_MIN_LENGTH} caracteres, con al menos una letra y un numero`}
        required
      >
        {(fieldProps) => (
          <Input
            {...fieldProps}
            type="password"
            autoComplete="new-password"
            placeholder="Cree una contrasena segura"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
      </FormField>

      <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
        Crear cuenta
      </Button>

      <p className={styles.footer}>
        Ya tiene una cuenta?{' '}
        <Link to={PATHS.LOGIN} className={styles.link}>
          Inicie sesion
        </Link>
      </p>
    </form>
  );
};
