import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PerpetualWithdrawalRetirementSimulator from './apps/perpetual-withdrawal-retirement-simulator/perpetual-withdrawal-retirement-simulator.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PerpetualWithdrawalRetirementSimulator/>
  </StrictMode>,
)
