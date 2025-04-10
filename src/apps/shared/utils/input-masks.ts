import { LocaleFormattingOptions } from '../types/calculator.types';

// Currency formatting options
export const currencyOptions: LocaleFormattingOptions = {
  en: {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  pt: {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
};

// Percentage formatting options
export const percentageOptions: LocaleFormattingOptions = {
  en: {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  },
  pt: {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
};

// Format currency based on locale
export const formatCurrency = (value: number, locale: string = 'en'): string => {
  if (value === 0) return '';
  return new Intl.NumberFormat(locale, currencyOptions[locale as keyof typeof currencyOptions] as Intl.NumberFormatOptions).format(value);
};

// Format percentage based on locale
export const formatPercentage = (value: number, locale: string = 'en'): string => {
  if (value === 0) return '';
  return new Intl.NumberFormat(locale, percentageOptions[locale as keyof typeof percentageOptions] as Intl.NumberFormatOptions).format(value);
};

// Parse currency string to number
export const parseCurrency = (value: string, locale: string = 'en'): number => {
  if (!value) return 0;
  
  // Remove currency symbol and any non-numeric characters except decimal separator
  const cleanValue = value.replace(/[^\d.,]/g, '');
  
  // Handle different decimal separators based on locale
  const decimalSeparator = locale === 'pt' ? ',' : '.';
  const thousandsSeparator = locale === 'pt' ? '.' : ',';
  
  // Replace thousands separator with empty string and decimal separator with dot
  const normalizedValue = cleanValue
    .replace(new RegExp(`\\${thousandsSeparator}`, 'g'), '')
    .replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');
  
  return parseFloat(normalizedValue) || 0;
};

// Parse percentage string to number
export const parsePercentage = (value: string, locale: string = 'en'): number => {
  if (!value) return 0;
  
  // Remove percentage symbol and any non-numeric characters except decimal separator
  const cleanValue = value.replace(/[^\d.,]/g, '');
  
  // Handle different decimal separators based on locale
  const decimalSeparator = locale === 'pt' ? ',' : '.';
  const thousandsSeparator = locale === 'pt' ? '.' : ',';
  
  // Replace thousands separator with empty string and decimal separator with dot
  const normalizedValue = cleanValue
    .replace(new RegExp(`\\${thousandsSeparator}`, 'g'), '')
    .replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');
  
  // Convert to decimal (divide by 100)
  return (parseFloat(normalizedValue) || 0) / 100;
}; 