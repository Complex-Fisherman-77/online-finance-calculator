import { useTranslation } from 'react-i18next';
import './feedback-button.css';

export function FeedbackButton() {
  const { t } = useTranslation();

  const handleFeedback = () => {
    window.open('https://forms.gle/your-feedback-form', '_blank');
  };

  return (
    <button 
      className="feedback-button"
      onClick={handleFeedback}
      title={t('common.feedback')}
    >
      Feedback
    </button>
  );
} 