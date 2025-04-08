import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import './language-switcher.css';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('lang', lang);
        setSearchParams(newParams);
    };

    return (
        <div className="language-switcher">
            <button 
                className={`lang-button ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en')}
            >
                EN
            </button>
            <button 
                className={`lang-button ${i18n.language === 'pt-BR' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('pt-BR')}
            >
                PT
            </button>
        </div>
    );
} 