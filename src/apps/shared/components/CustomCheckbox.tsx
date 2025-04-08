import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/custom-checkbox.css';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  translationKey?: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  translationKey
}) => {
  const { t } = useTranslation();
  
  // Use translation key if provided, otherwise use the label directly
  const translatedLabel = translationKey ? t(translationKey) : label;
  
  return (
    <div className="checkbox-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="checkbox-custom"></span>
        <span className="checkbox-text">{translatedLabel}</span>
      </label>
    </div>
  );
}; 