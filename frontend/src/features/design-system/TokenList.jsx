import { useTokenValues } from '../../hooks/useTokenValue.js';
import styles from '../../styles/features/design-system/DesignSystem.module.css';

export const TokenList = ({ tokens, renderPreview }) => {
  const values = useTokenValues(tokens.map((item) => item.token));

  return (
    <div className={styles.tokenList}>
      {tokens.map((item) => (
        <div key={item.token} className={styles.tokenRow}>
          <span className={styles.swatchToken}>{item.token}</span>

          <div className={styles.tokenPreview}>{renderPreview ? renderPreview(item.token) : null}</div>

          <span className={styles.swatchValue}>{values[item.token]}</span>
          <span className={styles.swatchUsage}>{item.usage}</span>
        </div>
      ))}
    </div>
  );
};

export const SpacingPreview = (token) => (
  <span className={styles.bar} style={{ width: `var(${token})` }} />
);

export const FontSizePreview = (token) => (
  <span style={{ fontSize: `var(${token})` }}>Biblioteca</span>
);

export const FontWeightPreview = (token) => (
  <span style={{ fontWeight: `var(${token})` }}>Biblioteca</span>
);

export const RadiusPreview = (token) => (
  <span className={styles.box} style={{ borderRadius: `var(${token})` }} />
);

export const ShadowPreview = (token) => (
  <span className={styles.shadowBox} style={{ boxShadow: `var(${token})` }} />
);

export const ControlHeightPreview = (token) => (
  <span className={styles.controlBox} style={{ height: `var(${token})` }}>
    Control
  </span>
);

export const WidthPreview = (token) => (
  <span className={styles.bar} style={{ width: `min(var(${token}), 100%)` }} />
);
