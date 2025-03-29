import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import PerpetualWithdrawalRetirementSimulator from './apps/perpetual-withdrawal-retirement-simulator/perpetual-withdrawal-retirement-simulator.tsx'
import FixedTimeWithdrawalRetirementSimulator from './apps/fixed-time-withdrawal-retirement-simulator/fixed-time-withdrawal-retirement-simulator.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/online-finance-calculator">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/perpetual-withdrawal" element={<PerpetualWithdrawalRetirementSimulator />} />
        <Route path="/fixed-time-withdrawal" element={<FixedTimeWithdrawalRetirementSimulator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
