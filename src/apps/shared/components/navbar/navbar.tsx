import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { FeedbackButton } from '../feedback-button/feedback-button';
import { FaHome } from 'react-icons/fa';
import './navbar.css';

export function Navbar() {
  const { i18n } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return null;

    return (
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-item">
          <FaHome className="home-icon" />
        </Link>
        {paths.map((path) => (
          <span key={path}>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-item">
              {path.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          {getBreadcrumbs()}
        </div>
        <div className="navbar-right">
          <FeedbackButton />
          <button className="language-toggle" onClick={toggleLanguage}>
            {i18n.language === 'en' ? 'PT' : 'EN'}
          </button>
        </div>
      </div>
    </nav>
  );
} 