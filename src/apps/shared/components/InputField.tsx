import React from 'react';
import '../styles/input-field.css';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
  min,
  max,
  step,
  placeholder,
}) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        type={type}
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
      />
    </div>
  );
}; 