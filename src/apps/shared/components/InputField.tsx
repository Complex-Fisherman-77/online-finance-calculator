import { NumericFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';
import '../styles/input-field.css';

interface InputFieldProps {
    label: string;
    value: number | string;
    onChange: (value: string) => void;
    type?: 'number' | 'currency' | 'percentage';
    disabled?: boolean;
    placeholder?: string;
}

export function InputField({
    label,
    value,
    onChange,
    type = 'number',
    disabled = false,
    placeholder
}: InputFieldProps) {
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    const getFormatProps = () => {
        switch (type) {
            case 'currency':
                return {
                    thousandSeparator: currentLocale === 'pt-BR' ? '.' : ',',
                    decimalSeparator: currentLocale === 'pt-BR' ? ',' : '.',
                    prefix: currentLocale === 'pt-BR' ? 'R$ ' : '$ ',
                    decimalScale: 2,
                    fixedDecimalScale: true
                };
            case 'percentage':
                return {
                    thousandSeparator: currentLocale === 'pt-BR' ? '.' : ',',
                    decimalSeparator: currentLocale === 'pt-BR' ? ',' : '.',
                    suffix: '%',
                    decimalScale: 2,
                    fixedDecimalScale: true
                };
            default:
                return {
                    thousandSeparator: currentLocale === 'pt-BR' ? '.' : ',',
                    decimalSeparator: currentLocale === 'pt-BR' ? ',' : '.',
                    decimalScale: 2
                };
        }
    };

    return (
        <div className="input-field">
            <label>{label}</label>
            <NumericFormat
                value={value}
                onValueChange={(values) => {
                    onChange(values.value);
                }}
                disabled={disabled}
                placeholder={placeholder}
                className="input"
                {...getFormatProps()}
            />
        </div>
    );
} 