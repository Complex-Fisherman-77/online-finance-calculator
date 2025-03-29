import { Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Free Online Finance Calculator</h1>
        <p>Simple and powerful financial tools to help you plan your future</p>
      </header>

      <div className="apps-grid">
        <Link to="/perpetual-withdrawal" className="app-card">
          <h2>Perpetual Withdrawal Calculator</h2>
          <p>Calculate how much you can withdraw from your retirement portfolio while maintaining its value over time, considering taxes and inflation.</p>
        </Link>

        <Link to="/fixed-time-withdrawal" className="app-card">
          <h2>Fixed Time Withdrawal Calculator</h2>
          <p>Plan your retirement withdrawals for a specific time period, taking into account taxes, inflation, and expected returns.</p>
        </Link>

        {/* Add more calculator cards here as you create them */}
      </div>
    </div>
  )
}

export default App
