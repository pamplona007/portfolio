import { useState } from 'react';
import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CrudForm } from '@/components/admin/CrudForm';
import type { ZodType } from 'zod';
import styles from './styles.module.css';

export type Language = 'en' | 'pt';

interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

interface TabbedTranslatableFormProps<T extends ZodType> {
  schema: T;
  defaultValues: Record<string, unknown>;
  fields: FieldConfig[];
  onSubmit: (data: Record<string, unknown>, lang: Language) => void;
  onCancel?: () => void;
  submitLabel?: string;
  localizedData: Record<string, Record<string, unknown>>;
  onLocalizedDataChange: (data: Record<string, Record<string, unknown>>) => void;
  children?: React.ReactNode;
}

export function TabbedTranslatableForm<T extends ZodType>({
  schema,
  defaultValues,
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  localizedData,
  onLocalizedDataChange,
}: TabbedTranslatableFormProps<T>) {
  const [activeLang, setActiveLang] = useState<Language>('en');
  const [formKey, setFormKey] = useState(activeLang);

  const handleTabSwitch = (newLang: Language) => {
    if (newLang === activeLang) return;
    setActiveLang(newLang);
    setFormKey(newLang);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    onSubmit(data, activeLang);
  };

  const currentLangFields = fields.map(f => ({
    ...f,
    name: `${f.name}.${activeLang}`,
  }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeLang === 'en' ? styles.active : ''}`}
          onClick={() => handleTabSwitch('en')}
        >
          EN English
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeLang === 'pt' ? styles.active : ''}`}
          onClick={() => handleTabSwitch('pt')}
        >
          PT Portugues
        </button>
      </div>
      <div className={styles.content}>
        <CrudForm
          key={formKey}
          schema={schema}
          defaultValues={localizedData[activeLang] ?? defaultValues}
          fields={currentLangFields}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          submitLabel={submitLabel}
          formKey={formKey}
        />
      </div>
    </div>
  );
}
