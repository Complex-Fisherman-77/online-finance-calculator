import React, { useEffect, useState } from 'react';
import './input-field.css';
import { formatCurrency, formatPercentage, parseCurrency, parsePercentage } from '../../utils/input-masks';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'currency' | 'percentage';
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  locale?: string;
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
  locale = 'en',
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [numericValue, setNumericValue] = useState<string>('');

  useEffect(() => {
    if (type === 'currency' && typeof value === 'number') {
      setDisplayValue(formatCurrency(value, locale));
      setNumericValue(String(value));
    } else if (type === 'percentage' && typeof value === 'number') {
      // For percentage, we display the value as a percentage (e.g., 10 for 10%)
      const percentageValue = value * 100;
      setDisplayValue(formatPercentage(value, locale));
      setNumericValue(String(percentageValue));
    } else {
      setDisplayValue(String(value));
      setNumericValue(String(value));
    }
  }, [value, type, locale]);

  const handleFocus = () => {
    setIsFocused(true);
    if (type === 'currency' || type === 'percentage') {
      setDisplayValue(numericValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (type === 'currency' && numericValue) {
      const numValue = parseFloat(numericValue);
      setDisplayValue(formatCurrency(numValue, locale));
    } else if (type === 'percentage' && numericValue) {
      // Convert percentage to decimal for display (e.g., 10 to 0.1)
      const percentageValue = parseFloat(numericValue) || 0;
      const decimalValue = percentageValue / 100;
      setDisplayValue(formatPercentage(decimalValue, locale));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (type === 'currency') {
      setNumericValue(inputValue);
      onChange(inputValue);
    } else if (type === 'percentage') {
      setNumericValue(inputValue);
      // Convert percentage to decimal for the parent component (e.g., 10 to 0.1)
      const percentageValue = parseFloat(inputValue) || 0;
      const decimalValue = percentageValue / 100;
      onChange(String(decimalValue));
    } else {
      onChange(inputValue);
    }
  };

  const getInputType = () => {
    if (isFocused && (type === 'currency' || type === 'percentage')) {
      return 'number';
    }
    return type === 'currency' || type === 'percentage' ? 'text' : type;
  };

  const getInputValue = () => {
    if (isFocused && (type === 'currency' || type === 'percentage')) {
      return numericValue;
    }
    return displayValue;
  };

  const getStepValue = () => {
    if (type === 'percentage') {
      return step || 0.01;
    }
    return step;
  };

  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        type={getInputType()}
        className={`input-field ${type === 'currency' ? 'input-currency' : ''} ${type === 'percentage' ? 'input-percentage' : ''}`}
        value={getInputValue()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        min={min}
        max={max}
        step={getStepValue()}
        placeholder={placeholder}
      />
    </div>
  );
}; 