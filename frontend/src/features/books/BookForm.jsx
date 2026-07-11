import { useState } from 'react';
import { createBookSchema } from '@biblioteca/shared';

import { Alert } from '../../components/ui/Alert.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormField } from '../../components/ui/FormField.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { Textarea } from '../../components/ui/Textarea.jsx';
import { useForm } from '../../hooks/useForm.js';
import { getFieldErrors } from '../../utils/errorMessage.js';
import coverStyles from '../../styles/features/books/BookCoverField.module.css';
import styles from '../../styles/features/shared/FormLayout.module.css';
import { BookCover } from './BookCover.jsx';

export const EMPTY_BOOK = {
  title: '',
  isbn: '',
  author: '',
  category: '',
  publisher: '',
  publicationYear: '',
  description: '',
  coverUrl: '',
  totalCopies: 1
};

export const toBookFormValues = (book) => ({
  title: book.title,
  isbn: book.isbn,
  author: book.author?._id ?? '',
  category: book.category?._id ?? '',
  publisher: book.publisher ?? '',
  publicationYear: book.publicationYear,
  description: book.description ?? '',
  coverUrl: book.coverUrl ?? '',
  totalCopies: book.totalCopies
});

export const BookForm = ({ initialValues, categories, authors, submitLabel, onSubmit, onCancel }) => {
  const [globalError, setGlobalError] = useState(null);
  const [coverFailed, setCoverFailed] = useState(false);

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, setErrors } = useForm({
    initialValues,
    schema: createBookSchema,
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

      <FormField label="Titulo" name="title" error={errors.title} required>
        {(fieldProps) => (
          <Input
            {...fieldProps}
            placeholder="Titulo del libro"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
      </FormField>

      <div className={styles.grid}>
        <FormField
          label="ISBN"
          name="isbn"
          error={errors.isbn}
          hint="10 o 13 digitos, con o sin guiones"
          required
        >
          {(fieldProps) => (
            <Input
              {...fieldProps}
              placeholder="9780132350884"
              value={values.isbn}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}
        </FormField>

        <FormField label="Anio de publicacion" name="publicationYear" error={errors.publicationYear} required>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              type="number"
              placeholder="2008"
              value={values.publicationYear}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}
        </FormField>

        <FormField label="Autor" name="author" error={errors.author} required>
          {(fieldProps) => (
            <Select
              {...fieldProps}
              placeholder="Seleccione un autor"
              value={values.author}
              onChange={handleChange}
              onBlur={handleBlur}
              options={authors.map((author) => ({ value: author._id, label: author.name }))}
            />
          )}
        </FormField>

        <FormField label="Categoria" name="category" error={errors.category} required>
          {(fieldProps) => (
            <Select
              {...fieldProps}
              placeholder="Seleccione una categoria"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              options={categories.map((category) => ({ value: category._id, label: category.name }))}
            />
          )}
        </FormField>

        <FormField label="Editorial" name="publisher" error={errors.publisher}>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              placeholder="Nombre de la editorial"
              value={values.publisher}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}
        </FormField>

        <FormField label="Ejemplares totales" name="totalCopies" error={errors.totalCopies} required>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              type="number"
              min="1"
              value={values.totalCopies}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}
        </FormField>
      </div>

      <div className={coverStyles.field}>
        <div className={coverStyles.input}>
          <FormField
            label="Portada"
            name="coverUrl"
            error={errors.coverUrl}
            hint="Enlace directo a la imagen. Debe terminar en la imagen misma, no en la pagina que la contiene"
          >
            {(fieldProps) => (
              <Input
                {...fieldProps}
                type="url"
                placeholder="https://ejemplo.com/portada.jpg"
                value={values.coverUrl}
                onChange={(event) => {
                  setCoverFailed(false);
                  handleChange(event);
                }}
                onBlur={handleBlur}
              />
            )}
          </FormField>

          {coverFailed ? (
            <Alert variant="warning" title="La imagen no se pudo cargar">
              Verifique que el enlace apunte directamente a una imagen y que el sitio de origen permita
              mostrarla desde otras paginas.
            </Alert>
          ) : null}
        </div>

        <div className={coverStyles.preview}>
          <span className={coverStyles.previewLabel}>Vista previa</span>
          <BookCover
            url={values.coverUrl}
            title={values.title || 'el libro'}
            size="sm"
            onError={() => setCoverFailed(true)}
          />
        </div>
      </div>

      <FormField label="Descripcion" name="description" error={errors.description}>
        {(fieldProps) => (
          <Textarea
            {...fieldProps}
            rows={4}
            placeholder="Resumen del contenido del libro"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )}
      </FormField>

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
