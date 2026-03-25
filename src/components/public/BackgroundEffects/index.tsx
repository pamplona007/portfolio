import styles from './styles.module.css';

export function BackgroundEffects() {
  return (
    <>
      {/* Gradient mesh orbs */}
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.orb3} aria-hidden="true" />
      {/* Grain overlay */}
      <div className={styles.grain} aria-hidden="true" />
    </>
  );
}
