import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomCheckbox, InputField, ResultTable, Navbar } from "../shared/components";
import { formatCurrency, formatPercentage } from "../shared/utils/input-masks";
import { useUrlParams } from "../shared/hooks/use-url-params";
import { PeriodData } from "../shared/types/calculator.types";
import { Line } from 'react-chartjs-2';
import styles from './perpetual-withdrawal-retirement-simulator.module.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function PerpetualWithdrawalRetirementSimulator() {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language;
    const { getParam, updateParams } = useUrlParams();
    
    const [grossAmount, setGrossAmount] = useState(parseFloat(getParam('grossAmount', '1000')));
    const [netAmount, setNetAmount] = useState(parseFloat(getParam('netAmount', '0')));
    const [useNetAmount, setUseNetAmount] = useState(getParam('useNetAmount', 'false') === 'true');
    const [desiredNetWithdrawalDeflated, setDesiredNetWithdrawalDeflated] = useState(parseFloat(getParam('desiredNetWithdrawalDeflated', '0')));
    const [useDesiredNetWithdrawalDeflated, setUseDesiredNetWithdrawalDeflated] = useState(getParam('useDesiredNetWithdrawalDeflated', 'false') === 'true');

    const [taxOnProfits, setTaxOnProfits] = useState(parseFloat(getParam('taxOnProfits', '15')));
    const [periodDays, setPeriodDays] = useState(parseFloat(getParam('periodDays', '252')));
    const [periods, setPeriods] = useState(parseFloat(getParam('periods', '30')));
    const [expectedProfitability, setExpectedProfitability] = useState(parseFloat(getParam('expectedProfitability', '10')));
    const [expectedInflation, setExpectedInflation] = useState(parseFloat(getParam('expectedInflation', '5')));
    const [efectiveRate, setEfectiveRate] = useState(0);

    const [periodsData, setPeriodsData] = useState<PeriodData[]>([]);

    useEffect(() => {
        if (useNetAmount && netAmount > 0 && taxOnProfits > 0) {
            const newGrossAmount = netAmount / (1 - taxOnProfits / 100);
            setGrossAmount(parseFloat(newGrossAmount.toFixed(2)));
        }
    }, [useNetAmount, netAmount, taxOnProfits]);

    useEffect(() => {
        if (expectedProfitability > 0 && expectedInflation > 0) {
            setEfectiveRate((1 + expectedProfitability / 100) / (1 + expectedInflation / 100) - 1);
        }
    }, [expectedProfitability, expectedInflation]);

    useEffect(() => {
        if (useDesiredNetWithdrawalDeflated && desiredNetWithdrawalDeflated > 0 && 
            taxOnProfits > 0 && expectedProfitability > 0 && expectedInflation > 0 && 
            efectiveRate > 0) {
            
            // Calculate the required initial balance to achieve the desired net withdrawal deflated
            // For perpetual withdrawal, we need to find the initial balance that will give us
            // the desired net withdrawal deflated in the first period
            
            // Calculate the required net deflated balance
            const requiredNetDeflatedBalance = desiredNetWithdrawalDeflated / efectiveRate;
            
            // Calculate the required net balance (not deflated)
            const requiredNetBalance = requiredNetDeflatedBalance;
            
            // Calculate the required gross balance
            const requiredGrossBalance = requiredNetBalance / (1 - taxOnProfits / 100);
            
            // Set the gross amount
            setGrossAmount(parseFloat(requiredGrossBalance.toFixed(2)));
            
            // Calculate and set the net amount
            const calculatedNetAmount = requiredGrossBalance * (1 - taxOnProfits / 100);
            setNetAmount(parseFloat(calculatedNetAmount.toFixed(2)));
            
            // Disable the useNetAmount option since we're calculating both values
            setUseNetAmount(false);
        }
    }, [useDesiredNetWithdrawalDeflated, desiredNetWithdrawalDeflated, taxOnProfits, expectedProfitability, expectedInflation, efectiveRate]);

    useEffect(() => {
        if (grossAmount > 0 && taxOnProfits > 0 && periodDays > 0 && periods > 0 && expectedProfitability > 0 && expectedInflation > 0 && efectiveRate > 0) {
            const dataArray: PeriodData[] = [];

            dataArray.push({
                period: 0,
                previousBalance: 0,
                previousBalanceNet: 0,
                previousBalanceNetDeflated: 0,
                balance: grossAmount,
                balanceNet: grossAmount * (1 - taxOnProfits / 100),
                inflationIndex: 1,
                balanceNetDeflated: (grossAmount * (1 - taxOnProfits / 100)) / 1,
                netWithdrawalDeflated: 0,
                netWithdrawal: 0,
                grossWithdrawal: 0,
                grossWithdrawalOverBalance: 0,
            });
            
            for (let i = 1; i <= periods; i++) {
                const data: PeriodData = {
                    period: i,
                    previousBalance: dataArray[i - 1].balance - dataArray[i - 1].grossWithdrawal,
                    previousBalanceNet: (dataArray[i - 1].balance - dataArray[i - 1].grossWithdrawal) * (1 - taxOnProfits / 100),
                    previousBalanceNetDeflated: ((dataArray[i - 1].balance - dataArray[i - 1].grossWithdrawal) * (1 - taxOnProfits / 100)) / dataArray[i - 1].inflationIndex,
                    balance: (dataArray[i - 1].balance - dataArray[i - 1].grossWithdrawal) * (1 + expectedProfitability / 100),
                    balanceNet: ((dataArray[i - 1].balance - dataArray[i - 1].grossWithdrawal) * (1 + expectedProfitability / 100)) * (1 - taxOnProfits / 100),
                    inflationIndex: dataArray[i - 1].inflationIndex * (1 + expectedInflation / 100),
                    balanceNetDeflated: (((dataArray[i - 1].balance - dataArray[i - 1].grossWithdrawal) * (1 + expectedProfitability / 100)) * (1 - taxOnProfits / 100)) / (dataArray[i - 1].inflationIndex * (1 + expectedInflation / 100)),
                    netWithdrawalDeflated: 0,
                    netWithdrawal: 0,
                    grossWithdrawal: 0,
                    grossWithdrawalOverBalance: 0,
                };

                data.balanceNetDeflated = data.balanceNet / data.inflationIndex;
                data.netWithdrawalDeflated = data.balanceNetDeflated - data.previousBalanceNetDeflated;
                data.netWithdrawal = data.netWithdrawalDeflated * data.inflationIndex;
                data.grossWithdrawal = data.netWithdrawal / (1 - taxOnProfits / 100);
                data.grossWithdrawalOverBalance = data.grossWithdrawal / data.balance;

                dataArray.push(data);
            }

            dataArray.push({
                period: periods + 1,
                previousBalance: dataArray[dataArray.length - 1].balance - dataArray[dataArray.length - 1].grossWithdrawal,
                previousBalanceNet: 0,
                previousBalanceNetDeflated: 0,
                balance: 0,
                balanceNet: 0,
                inflationIndex: dataArray[dataArray.length - 1].inflationIndex * (1 + expectedInflation / 100),
                balanceNetDeflated: 0,
                netWithdrawalDeflated: 0,
                netWithdrawal: 0,
                grossWithdrawal: 0,
                grossWithdrawalOverBalance: 0,
            });

            setPeriodsData(dataArray);
        }
    }, [grossAmount, taxOnProfits, periodDays, periods, expectedProfitability, expectedInflation, efectiveRate]);

    const handleSetAmount = (amount: string, setAmount: (amount: number) => void, paramName: string) => {
        const numAmount = parseFloat(amount);
        setAmount(numAmount);
        updateParams({ [paramName]: amount });
    };

    const handleCheckboxChange = (checked: boolean, setChecked: (checked: boolean) => void, paramName: string) => {
        setChecked(checked);
        updateParams({ [paramName]: checked.toString() });
    };

    const tableHeaders = [
        t('table.period'),
        t('table.previousBalance'),
        t('table.previousBalanceNet'),
        t('table.previousBalanceNetDeflated'),
        t('table.balance'),
        t('table.balanceNet'),
        t('table.inflationIndex'),
        t('table.balanceNetDeflated'),
        t('table.netWithdrawalDeflated'),
        t('table.netWithdrawal'),
        t('table.grossWithdrawal'),
        t('table.grossWithdrawalOverBalance')
    ];

    const tableData = periodsData.map(data => [
        data.period,
        formatCurrency(data.previousBalance, currentLocale),
        formatCurrency(data.previousBalanceNet, currentLocale),
        formatCurrency(data.previousBalanceNetDeflated, currentLocale),
        formatCurrency(data.balance, currentLocale),
        formatCurrency(data.balanceNet, currentLocale),
        data.inflationIndex.toFixed(4),
        formatCurrency(data.balanceNetDeflated, currentLocale),
        formatCurrency(data.netWithdrawalDeflated, currentLocale),
        formatCurrency(data.netWithdrawal, currentLocale),
        formatCurrency(data.grossWithdrawal, currentLocale),
        formatPercentage(data.grossWithdrawalOverBalance, currentLocale)
    ]);

    // Chart configurations
    const balanceChartData = {
        labels: periodsData.slice(1).map(data => `Period ${data.period}`),
        datasets: [
            {
                label: 'Balance',
                data: periodsData.slice(1).map(data => data.balance),
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                fill: true,
            },
            {
                label: 'Gross Withdrawal',
                data: periodsData.slice(1).map(data => data.grossWithdrawal),
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                fill: true,
            }
        ]
    };

    const netDeflatedChartData = {
        labels: periodsData.slice(1).map(data => `Period ${data.period}`),
        datasets: [
            {
                label: 'Previous Balance Net Deflated',
                data: periodsData.slice(1).map(data => data.previousBalanceNetDeflated),
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true,
            },
            {
                label: 'Net Withdrawal Deflated',
                data: periodsData.slice(1).map(data => data.netWithdrawalDeflated),
                borderColor: '#f1c40f',
                backgroundColor: 'rgba(241, 196, 15, 0.1)',
                fill: true,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return (
        <div className={styles.container}>
            <Navbar title={t('calculators.perpetual.title')} />
            
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('common.amountSettings')}</h2>
                <div className={styles.amountSection}>
                    <div className={styles.inputGroup}>
                        <InputField
                            label={t('common.grossAmount')}
                            value={grossAmount || ''}
                            onChange={(value: string) => handleSetAmount(value, setGrossAmount, 'grossAmount')}
                            type="currency"
                            disabled={useNetAmount || useDesiredNetWithdrawalDeflated}
                            placeholder={t('common.enterGrossAmount')}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <CustomCheckbox
                            checked={useNetAmount}
                            onChange={(checked: boolean) => handleCheckboxChange(checked, setUseNetAmount, 'useNetAmount')}
                            label={t('common.useNetAmount')}
                            disabled={useDesiredNetWithdrawalDeflated}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <InputField
                            label={t('common.netAmount')}
                            value={netAmount || ''}
                            onChange={(value: string) => handleSetAmount(value, setNetAmount, 'netAmount')}
                            type="currency"
                            disabled={!useNetAmount || useDesiredNetWithdrawalDeflated}
                            placeholder={t('common.enterNetAmount')}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <CustomCheckbox
                            checked={useDesiredNetWithdrawalDeflated}
                            onChange={(checked: boolean) => handleCheckboxChange(checked, setUseDesiredNetWithdrawalDeflated, 'useDesiredNetWithdrawalDeflated')}
                            label={t('common.useDesiredNetWithdrawalDeflated')}
                            disabled={useNetAmount}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <InputField
                            label={t('common.desiredNetWithdrawalDeflated')}
                            value={desiredNetWithdrawalDeflated || ''}
                            onChange={(value: string) => handleSetAmount(value, setDesiredNetWithdrawalDeflated, 'desiredNetWithdrawalDeflated')}
                            type="currency"
                            disabled={!useDesiredNetWithdrawalDeflated}
                            placeholder={t('common.enterDesiredNetWithdrawalDeflated')}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('common.settings')}</h2>
                <div className={styles.inputsSection}>
                    <InputField
                        label={t('common.periodInDays')}
                        value={periodDays}
                        onChange={(value: string) => handleSetAmount(value, setPeriodDays, 'periodDays')}
                        type="number"
                        disabled
                        placeholder={t('common.enterPeriodInDays')}
                    />
                    <InputField
                        label={t('common.numberOfPeriods')}
                        value={periods}
                        onChange={(value: string) => handleSetAmount(value, setPeriods, 'periods')}
                        type="number"
                        placeholder={t('common.enterNumberOfPeriods')}
                    />
                    <InputField
                        label={t('common.taxOnProfits')}
                        value={taxOnProfits || ''}
                        onChange={(value: string) => handleSetAmount(value, setTaxOnProfits, 'taxOnProfits')}
                        type="percentage"
                        placeholder={t('common.enterTaxPercentage')}
                    />
                    <InputField
                        label={t('common.expectedProfitability')}
                        value={expectedProfitability || ''}
                        onChange={(value: string) => handleSetAmount(value, setExpectedProfitability, 'expectedProfitability')}
                        type="percentage"
                        placeholder={t('common.enterExpectedProfitability')}
                    />
                    <InputField
                        label={t('common.expectedInflation')}
                        value={expectedInflation || ''}
                        onChange={(value: string) => handleSetAmount(value, setExpectedInflation, 'expectedInflation')}
                        type="percentage"
                        placeholder={t('common.enterExpectedInflation')}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('common.results')}</h2>
                <div className={styles.resultSection}>
                    <ResultTable
                        headers={tableHeaders}
                        data={tableData}
                        translateHeaders={false}
                    />
                </div>
                <div className={styles.chartsSection}>
                    <div className={styles.chartContainer}>
                        <h3>{t('charts.balanceAndGrossWithdrawal')}</h3>
                        <div style={{ height: '400px' }}>
                            <Line data={balanceChartData} options={chartOptions} />
                        </div>
                    </div>
                    <div className={styles.chartContainer}>
                        <h3>{t('charts.netDeflatedValues')}</h3>
                        <div style={{ height: '400px' }}>
                            <Line data={netDeflatedChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerpetualWithdrawalRetirementSimulator;