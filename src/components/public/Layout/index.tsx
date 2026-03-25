import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { BackgroundEffects } from '../BackgroundEffects';
import styles from './styles.module.css';

export function PublicLayout() {
  return (
    <div className={styles.wrapper}>
      <BackgroundEffects />
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
