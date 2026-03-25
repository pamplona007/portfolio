import { useForm, Path } from 'react-hook-form';
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

interface CrudFormProps<T extends z.ZodType> {
  schema: T;
  defaultValues: z.infer<T>;
  fields: FieldConfig[];
  onSubmit: (data: z.infer<T>) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  children?: React.ReactNode;
}

export function CrudForm<T extends z.ZodType>({
  schema,
  defaultValues,
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  children,
}: CrudFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {fields.map((field) => (
        <div key={field.name} className={styles.field}>
          <label htmlFor={field.name} className={styles.label}>
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              rows={field.rows ?? 4}
              className={`${styles.textarea} ${errors[field.name as keyof z.infer<T>] ? styles.inputError : ''}`}
              placeholder={field.placeholder}
              {...register(field.name as Path<z.infer<T>>)}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              className={`${styles.select} ${errors[field.name as keyof z.infer<T>] ? styles.inputError : ''}`}
              {...register(field.name as Path<z.infer<T>>)}
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
              className={`${styles.input} ${errors[field.name as keyof z.infer<T>] ? styles.inputError : ''}`}
              placeholder={field.placeholder}
              {...register(field.name as Path<z.infer<T>>)}
            />
          )}
          {errors[field.name as keyof z.infer<T>] && (
            <span className={styles.error}>{String(errors[field.name as keyof z.infer<T>]?.message)}</span>
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
