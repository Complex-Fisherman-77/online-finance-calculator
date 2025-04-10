import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './navbar.css';
import { GoogleFormsFeedback } from '../feedback-button/feedback-button';

export function Navbar() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const handleTitleOnClick = () => {
    navigate("/");
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