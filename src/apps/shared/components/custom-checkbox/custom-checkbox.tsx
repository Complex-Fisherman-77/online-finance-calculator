import React from 'react';
import styles from './custom-checkbox.module.css';

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CustomCheckbox({
  label,
  checked,
  onChange,
  disabled = false
}: CustomCheckboxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className={styles.container}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.checkbox}
      />
      <span className={styles.label}>{label}</span>
    </label>
  );
} 