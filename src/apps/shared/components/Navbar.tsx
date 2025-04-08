import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher/language-switcher';
import './Navbar.css';

interface NavbarProps {
    title: string;
}

export function Navbar({ title }: NavbarProps) {
    const { t } = useTranslation();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h1 className="navbar-title">{title}</h1>
            </div>
            <div className="navbar-right">
                <LanguageSwitcher />
                <a 
                    href="https://forms.gle/your-feedback-form-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="feedback-button"
                >
                    {t('common.feedback')}
                </a>
            </div>
        </nav>
    );
} 