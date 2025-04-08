import { useTranslation } from "react-i18next";
import { InputField } from "./InputField";

interface CalculatorSettingsProps {
    periodDays: number;
    periods: number;
    taxOnProfits: number;
    expectedProfitability: number;
    expectedInflation: number;
    onSettingChange: (value: string, settingName: string) => void;
}

export function CalculatorSettings({
    periodDays,
    periods,
    taxOnProfits,
    expectedProfitability,
    expectedInflation,
    onSettingChange
}: CalculatorSettingsProps) {
    const { t } = useTranslation();

    return (
        <div className="calculator-section">
            <h2 className="section-title">{t('common.settings')}</h2>
            <div className="inputs-section">
                <InputField
                    label={t('common.periodInDays')}
                    value={periodDays}
                    onChange={(value: string) => onSettingChange(value, 'periodDays')}
                    type="number"
                    disabled
                    placeholder={t('common.enterPeriodInDays')}
                    translationKey="common.periodInDays"
                />
                <InputField
                    label={t('common.numberOfPeriods')}
                    value={periods}
                    onChange={(value: string) => onSettingChange(value, 'periods')}
                    type="number"
                    placeholder={t('common.enterNumberOfPeriods')}
                    translationKey="common.numberOfPeriods"
                />
                <InputField
                    label={t('common.taxOnProfits')}
                    value={taxOnProfits || ''}
                    onChange={(value: string) => onSettingChange(value, 'taxOnProfits')}
                    type="percentage"
                    placeholder={t('common.enterTaxPercentage')}
                    translationKey="common.taxOnProfits"
                />
                <InputField
                    label={t('common.expectedProfitability')}
                    value={expectedProfitability || ''}
                    onChange={(value: string) => onSettingChange(value, 'expectedProfitability')}
                    type="percentage"
                    placeholder={t('common.enterExpectedProfitability')}
                    translationKey="common.expectedProfitability"
                />
                <InputField
                    label={t('common.expectedInflation')}
                    value={expectedInflation || ''}
                    onChange={(value: string) => onSettingChange(value, 'expectedInflation')}
                    type="percentage"
                    placeholder={t('common.enterExpectedInflation')}
                    translationKey="common.expectedInflation"
                />
            </div>
        </div>
    );
} 