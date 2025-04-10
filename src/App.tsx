import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './App.css'

function App() {
  const { t } = useTranslation();
  
  return (
    <div className="app-container">
      <div className="apps-grid">
        <Link to="/perpetual-withdrawal" className="app-card">
          <h2>{t('calculators.perpetual.title')}</h2>
          <p>{t('calculators.perpetual.description')}</p>
        </Link>

        <Link to="/fixed-time-withdrawal" className="app-card">
          <h2>{t('calculators.fixedTime.title')}</h2>
          <p>{t('calculators.fixedTime.description')}</p>
        </Link>

        {/* Add more calculator cards here as you create them */}
      </div>
    </div>
  )
}

export default App
