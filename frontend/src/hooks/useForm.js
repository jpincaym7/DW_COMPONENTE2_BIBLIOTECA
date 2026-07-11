import { useCallback, useState } from 'react';

const toFieldErrors = (issues) =>
  issues.reduce((accumulator, issue) => {
    const field = issue.path[0];

    if (field && !accumulator[field]) {
      accumulator[field] = issue.message;
    }

    return accumulator;
  }, {});

const readEventValue = (event) => {
  const { type, value, checked } = event.target;
  return type === 'checkbox' ? checked : value;
};

export const useForm = ({ initialValues, schema, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldError = useCallback((field, message) => {
    setErrors((current) => ({ ...current, [field]: message }));
  }, []);

  const setFieldValue = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const handleChange = useCallback((event) => {
    const { name } = event.target;
    const value = readEventValue(event);

    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }, []);

  const validateField = useCallback(
    (field, currentValues) => {
      const result = schema.safeParse(currentValues);

      if (result.success) {
        setErrors((current) => ({ ...current, [field]: undefined }));
        return;
      }

      const fieldErrors = toFieldErrors(result.error.issues);
      setErrors((current) => ({ ...current, [field]: fieldErrors[field] }));
    },
    [schema]
  );

  const handleBlur = useCallback(
    (event) => {
      const { name } = event.target;

      setTouched((current) => ({ ...current, [name]: true }));
      validateField(name, values);
    },
    [validateField, values]
  );

  const reset = useCallback(
    (nextValues = initialValues) => {
      setValues(nextValues);
      setErrors({});
      setTouched({});
    },
    [initialValues]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const result = schema.safeParse(values);

      if (!result.success) {
        const fieldErrors = toFieldErrors(result.error.issues);
        setErrors(fieldErrors);
        setTouched(
          Object.keys(values).reduce((accumulator, key) => ({ ...accumulator, [key]: true }), {})
        );
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(result.data, { setFieldError, setErrors });
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, schema, setFieldError, values]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setErrors,
    reset
  };
};
