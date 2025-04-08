import { useTranslation } from "react-i18next";
import { InputField } from "./InputField";
import { CustomCheckbox } from "./CustomCheckbox";

interface AmountSettingsProps {
    grossAmount: number;
    netAmount: number;
    useNetAmount: boolean;
    desiredNetWithdrawalDeflated: number;
    useDesiredNetWithdrawalDeflated: boolean;
    onAmountChange: (value: string, settingName: string) => void;
    onCheckboxChange: (checked: boolean, settingName: string) => void;
}

export function AmountSettings({
    grossAmount,
    netAmount,
    useNetAmount,
    desiredNetWithdrawalDeflated,
    useDesiredNetWithdrawalDeflated,
    onAmountChange,
    onCheckboxChange
}: AmountSettingsProps) {
    const { t } = useTranslation();

    return (
        <div className="calculator-section">
            <h2 className="section-title">{t('common.amountSettings')}</h2>
            <div className="amount-section">
                <InputField
                    label={t('common.grossAmount')}
                    value={grossAmount || ''}
                    onChange={(value: string) => onAmountChange(value, 'grossAmount')}
                    type="currency"
                    disabled={useNetAmount || useDesiredNetWithdrawalDeflated}
                    placeholder={t('common.enterGrossAmount')}
                    translationKey="common.grossAmount"
                />
                <CustomCheckbox
                    checked={useNetAmount}
                    onChange={(checked: boolean) => onCheckboxChange(checked, 'useNetAmount')}
                    label={t('common.useNetAmount')}
                    disabled={useDesiredNetWithdrawalDeflated}
                    translationKey="common.useNetAmount"
                />
                <InputField
                    label={t('common.netAmount')}
                    value={netAmount || ''}
                    onChange={(value: string) => onAmountChange(value, 'netAmount')}
                    type="currency"
                    disabled={!useNetAmount || useDesiredNetWithdrawalDeflated}
                    placeholder={t('common.enterNetAmount')}
                    translationKey="common.netAmount"
                />
                <CustomCheckbox
                    checked={useDesiredNetWithdrawalDeflated}
                    onChange={(checked: boolean) => onCheckboxChange(checked, 'useDesiredNetWithdrawalDeflated')}
                    label={t('common.useDesiredNetWithdrawalDeflated')}
                    disabled={useNetAmount}
                    translationKey="common.useDesiredNetWithdrawalDeflated"
                />
                <InputField
                    label={t('common.desiredNetWithdrawalDeflated')}
                    value={desiredNetWithdrawalDeflated || ''}
                    onChange={(value: string) => onAmountChange(value, 'desiredNetWithdrawalDeflated')}
                    type="currency"
                    disabled={!useDesiredNetWithdrawalDeflated}
                    placeholder={t('common.enterDesiredNetWithdrawalDeflated')}
                    translationKey="common.desiredNetWithdrawalDeflated"
                />
            </div>
        </div>
    );
} 