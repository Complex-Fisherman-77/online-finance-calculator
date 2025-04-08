import React from 'react';
import styles from './input-field.module.css';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'currency' | 'percentage';
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  id,
  className
}: InputFieldProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    onChange(numericValue);
  };

  const formatValue = (value: number | string): string => {
    if (value === null || value === undefined || value === '') return '';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';

    if (type === 'currency') {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'BRL'
      }).format(numValue);
    } else if (type === 'percentage') {
      return `${numValue}%`;
    }

    return String(value);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        value={formatValue(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${styles.input} ${className || ''}`}
        disabled={disabled}
      />
    </div>
  );
} 