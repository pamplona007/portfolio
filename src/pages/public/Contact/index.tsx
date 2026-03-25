import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Github, Linkedin, Mail, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/public/Button';
import { useContact } from '@/hooks/useContact';
import { trackPageView } from '@/services/analytics';
import styles from './styles.module.css';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const formRef = useScrollReveal();
  const infoRef = useScrollReveal();
  const { submitContact, loading } = useContact();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    trackPageView('/contact');
  }, []);

  const onSubmit = async (data: ContactForm) => {
    try {
      setServerError(null);
      await submitContact(data);
      setSubmitted(true);
      reset();
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <CheckCircle size={40} />
            </div>
            <h2 className={styles.successTitle}>{t('contact.successTitle')}</h2>
            <p className={styles.successText}>
              {t('contact.successText')}
            </p>
            <Button variant="ghost" onClick={() => setSubmitted(false)}>
              {t('contact.sendAnother')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Form */}
          <div ref={formRef} className={`${styles.formSection} reveal`}>
            <h1 className={styles.heading}>
              {t('contact.title')}
            </h1>
            <p className={styles.subheading}>
              {t('contact.subtitle')}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>{t('contact.name')}</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder={t('contact.namePlaceholder')}
                  {...register('name')}
                />
                {errors.name && <span className={styles.error}>{errors.name.message}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>{t('contact.email')}</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder={t('contact.emailPlaceholder')}
                  {...register('email')}
                />
                {errors.email && <span className={styles.error}>{errors.email.message}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="message" className={styles.label}>{t('contact.message')}</label>
                <textarea
                  id="message"
                  rows={6}
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                  placeholder={t('contact.messagePlaceholder')}
                  {...register('message')}
                />
                {errors.message && <span className={styles.error}>{errors.message.message}</span>}
              </div>

              {serverError && <div className={styles.serverError}>{serverError}</div>}

              <Button type="submit" variant="primary" size="lg" loading={loading}>
                <Send size={16} />
                {t('contact.send')}
              </Button>
            </form>
          </div>

          {/* Info Panel */}
          <div ref={infoRef} className={`${styles.infoPanel} reveal`} style={{ animationDelay: '150ms' }}>
            <h3 className={styles.infoTitle}>{t('contact.infoTitle')}</h3>
            <p className={styles.infoText}>
              {t('contact.infoText')}
            </p>
            <div className={styles.infoLinks}>
              <a href="https://github.com/lucaspamplona" target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                <Github size={20} />
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com/in/lucaspamplona" target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
              <a href="mailto:lucas@pamplona.dev" className={styles.infoLink}>
                <Mail size={20} />
                <span>lucas@pamplona.dev</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
