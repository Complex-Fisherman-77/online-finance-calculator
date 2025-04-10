import { useTranslation } from 'react-i18next';
import { InputField } from '../input-field/input-field';
import { CustomCheckbox } from '../custom-checkbox/custom-checkbox';
import './amount-settings.css';

interface AmountSettingsProps {
  initialBalance: number;
  onInitialBalanceChange: (value: number) => void;
  netWithdrawal: number;
  onNetWithdrawalChange: (value: number) => void;
  isNetWithdrawalDeflated: boolean;
  onIsNetWithdrawalDeflatedChange: (checked: boolean) => void;
}

export function AmountSettings({
  initialBalance,
  onInitialBalanceChange,
  netWithdrawal,
  onNetWithdrawalChange,
  isNetWithdrawalDeflated,
  onIsNetWithdrawalDeflatedChange
}: AmountSettingsProps) {
  const { t } = useTranslation();

  return (
    <div className="container">
      <h2 className="title">{t('common.amountSettings')}</h2>
      <div className="amount-section">
        <div className="input-group">
          <InputField
            label={t('common.grossAmount')}
            value={initialBalance}
            onChange={(value) => onInitialBalanceChange(parseFloat(value))}
            type="currency"
            placeholder={t('common.enterGrossAmount')}
          />
        </div>
        <div className="input-group">
          <InputField
            label={t('common.netAmount')}
            value={netWithdrawal}
            onChange={(value) => onNetWithdrawalChange(parseFloat(value))}
            type="currency"
            placeholder={t('common.enterNetAmount')}
          />
        </div>
        <div className="input-group">
          <CustomCheckbox
            label={t('common.useDesiredNetWithdrawalDeflated')}
            checked={isNetWithdrawalDeflated}
            onChange={onIsNetWithdrawalDeflatedChange}
          />
        </div>
      </div>
    </div>
  );
} 