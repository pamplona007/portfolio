import { useForm } from 'react-hook-form';
import { forwardRef, useImperativeHandle } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './styles.module.css';

interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

export interface CrudFormRef {
  getValues: () => Record<string, unknown>;
}

interface CrudFormProps {
  schema: z.ZodType;
  defaultValues: Record<string, unknown>;
  fields: FieldConfig[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  children?: React.ReactNode;
  formKey?: string;
}

export const CrudForm = forwardRef<CrudFormRef, CrudFormProps>(
  function CrudForm(
    {
      schema,
      defaultValues,
      fields,
      onSubmit,
      onCancel,
      submitLabel = 'Save',
      children,
    },
    ref
  ) {
    const {
      register,
      handleSubmit,
      getValues,
      formState: { errors, isSubmitting },
    } = useForm({
      resolver: zodResolver(schema),
      defaultValues,
    });

    useImperativeHandle(ref, () => ({
      getValues: () => getValues() as Record<string, unknown>,
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit as (data: Record<string, unknown>) => Promise<void>)} className={styles.form}>
        {fields.map((field) => (
          <div key={field.name} className={styles.field}>
            <label htmlFor={field.name} className={styles.label}>
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                rows={field.rows ?? 4}
                className={`${styles.textarea} ${errors[field.name] ? styles.inputError : ''}`}
                placeholder={field.placeholder}
                {...register(field.name)}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                className={`${styles.select} ${errors[field.name] ? styles.inputError : ''}`}
                {...register(field.name)}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type ?? 'text'}
                className={`${styles.input} ${errors[field.name] ? styles.inputError : ''}`}
                placeholder={field.placeholder}
                {...register(field.name)}
              />
            )}
            {errors[field.name] && (
              <span className={styles.error}>{String(errors[field.name]?.message)}</span>
            )}
          </div>
        ))}

        {children}

        <div className={styles.actions}>
          {onCancel && (
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    );
  }
);
