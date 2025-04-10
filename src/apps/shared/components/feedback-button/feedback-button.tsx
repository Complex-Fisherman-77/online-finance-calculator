import { useTranslation } from 'react-i18next';
import './feedback-button.css';

export function GoogleFormsFeedback() {
  const formLink = 'https://docs.google.com/forms/d/e/1FAIpQLSfFOIM1Yv-wm9rWxQB2h5egliEJN3rxXE_P562ZfApqIsxeew/viewform?usp=header';
  const { t } = useTranslation();

  return (
      <div className="feedback-corner">
      <a
          href={formLink}
          target="_blank"
          rel="noopener noreferrer"
          className="feedback-button"
          title={t('common.feedback')}
      >
          Feedback
      </a>
      </div>
    );
}