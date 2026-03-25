import { Outlet } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { BackgroundEffects } from '../BackgroundEffects';
import styles from './styles.module.css';

export function PublicLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <div className={styles.wrapper}>
        <BackgroundEffects />
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </I18nextProvider>
  );
}
