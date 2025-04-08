import { useTranslation } from 'react-i18next';
import { InputField } from '../input-field/input-field';
import styles from './settings.module.css';

interface SettingsProps {
  periodDays: number;
  periods: number;
  taxOnProfits: number;
  expectedProfitability: number;
  expectedInflation: number;
  onPeriodDaysChange: (value: string) => void;
  onPeriodsChange: (value: string) => void;
  onTaxOnProfitsChange: (value: string) => void;
  onExpectedProfitabilityChange: (value: string) => void;
  onExpectedInflationChange: (value: string) => void;
}

export function Settings({
  periodDays,
  periods,
  taxOnProfits,
  expectedProfitability,
  expectedInflation,
  onPeriodDaysChange,
  onPeriodsChange,
  onTaxOnProfitsChange,
  onExpectedProfitabilityChange,
  onExpectedInflationChange
}: SettingsProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('common.settings')}</h2>
      <div className={styles.inputsSection}>
        <InputField
          label={t('common.periodDays')}
          value={periodDays}
          onChange={onPeriodDaysChange}
          type="number"
        />
        <InputField
          label={t('common.periods')}
          value={periods}
          onChange={onPeriodsChange}
          type="number"
        />
        <InputField
          label={t('common.taxOnProfits')}
          value={taxOnProfits}
          onChange={onTaxOnProfitsChange}
          type="percentage"
        />
        <InputField
          label={t('common.expectedProfitability')}
          value={expectedProfitability}
          onChange={onExpectedProfitabilityChange}
          type="percentage"
        />
        <InputField
          label={t('common.expectedInflation')}
          value={expectedInflation}
          onChange={onExpectedInflationChange}
          type="percentage"
        />
      </div>
    </div>
  );
} 