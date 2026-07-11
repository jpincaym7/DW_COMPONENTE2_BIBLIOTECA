import { useTokenValues } from '../../hooks/useTokenValue.js';
import styles from '../../styles/features/design-system/DesignSystem.module.css';

export const ColorSwatchGrid = ({ colors }) => {
  const values = useTokenValues(colors.map((color) => color.token));

  return (
    <div className={styles.swatchGrid}>
      {colors.map((color) => (
        <div key={color.token} className={styles.swatch}>
          <div className={styles.swatchColor} style={{ backgroundColor: `var(${color.token})` }} />
          <span className={styles.swatchToken}>{color.token}</span>
          <span className={styles.swatchValue}>{values[color.token]}</span>
          {color.usage ? <span className={styles.swatchUsage}>{color.usage}</span> : null}
        </div>
      ))}
    </div>
  );
};

export const ColorScale = ({ colors }) => (
  <div className={styles.scale}>
    {colors.map((color) => (
      <div
        key={color.token}
        className={styles.scaleStep}
        style={{ backgroundColor: `var(${color.token})` }}
        title={color.token}
      />
    ))}
  </div>
);
