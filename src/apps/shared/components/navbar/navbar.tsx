import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleFormsFeedback } from '../feedback-button/feedback-button';
import './navbar.css';

export function Navbar() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLanguage, () => {
      searchParams.set('lang', i18n.language);
      setSearchParams(searchParams, { replace: true });
    });
  };

  const handleTitleOnClick = () => {
    navigate("/?lang=" + i18n.language);
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div></div>
        <div className='navbar-center'>
          <h1 onClick={handleTitleOnClick}>{t('app.title')}</h1>
        </div>
        <div className='navbar-right'>
          <GoogleFormsFeedback />
          <button className="language-toggle" onClick={toggleLanguage}>
            {i18n.language === 'en' ? 'PT' : 'EN'}
          </button>
        </div>
      </div>
    </nav>
  );
} 