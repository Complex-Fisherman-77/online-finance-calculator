import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResultTable } from "../shared/components/result-table/result-table";
import { AmountSettings } from "../shared/components/amount-settings/amount-settings";
import { Settings } from "../shared/components/settings/settings";
import { formatCurrency, formatPercentage } from "../shared/utils/input-masks";
import { useUrlParams } from "../shared/hooks/use-url-params";
import { PeriodData } from "../shared/types/calculator.types";
import { Line } from 'react-chartjs-2';
import styles from './fixed-time-withdrawal-retirement-simulator.module.css';
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

function FixedTimeWithdrawalRetirementSimulator() {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language;
    const { getParam, updateParams } = useUrlParams();
    
    const [grossAmount, setGrossAmount] = useState(parseFloat(getParam('grossAmount', '1000')));
    const [netAmount, setNetAmount] = useState(parseFloat(getParam('netAmount', '0')));
    const [useDesiredNetWithdrawalDeflated, setUseDesiredNetWithdrawalDeflated] = useState(getParam('useDesiredNetWithdrawalDeflated', 'false') === 'true');

    const [taxOnProfits, setTaxOnProfits] = useState(parseFloat(getParam('taxOnProfits', '0.15')));
    const [periodDays, setPeriodDays] = useState(parseFloat(getParam('periodDays', '252')));
    const [periods, setPeriods] = useState(parseFloat(getParam('periods', '30')));
    const [expectedProfitability, setExpectedProfitability] = useState(parseFloat(getParam('expectedProfitability', '0.10')));
    const [expectedInflation, setExpectedInflation] = useState(parseFloat(getParam('expectedInflation', '0.05')));
    const [efectiveRate, setEfectiveRate] = useState(0);

    const [periodsData, setPeriodsData] = useState<PeriodData[]>([]);

    useEffect(() => {
        if (expectedProfitability > 0 && expectedInflation > 0) {
            setEfectiveRate((1 + expectedProfitability) / (1 + expectedInflation) - 1);
        }
    }, [expectedProfitability, expectedInflation]);

    useEffect(() => {
        if (grossAmount > 0 && taxOnProfits > 0 && periodDays > 0 && periods > 0 && expectedProfitability > 0 && expectedInflation > 0 && efectiveRate > 0) {
            const dataArray: PeriodData[] = [];

            // Calculate the withdrawal factor for fixed time periods
            const withdrawalFactor = efectiveRate / (1 - Math.pow(1 + efectiveRate, -periods));
            
            // Calculate the initial net withdrawal deflated
            const initialNetWithdrawalDeflated = (grossAmount * (1 - taxOnProfits)) * withdrawalFactor;

            dataArray.push({
                period: 0,
                previousBalance: 0,
                previousBalanceNet: 0,
                previousBalanceNetDeflated: 0,
                balance: grossAmount,
                balanceNet: grossAmount * (1 - taxOnProfits),
                inflationIndex: 1,
                balanceNetDeflated: (grossAmount * (1 - taxOnProfits)) / 1,
                netWithdrawalDeflated: 0,
                netWithdrawal: 0,
                grossWithdrawal: 0,
                grossWithdrawalOverBalance: 0,
            });
            
            for (let i = 1; i <= periods; i++) {
                const previousBalance = dataArray[i - 1].balance - dataArray[i - 1].grossWithdrawal;
                const previousBalanceNet = previousBalance * (1 - taxOnProfits);
                const previousBalanceNetDeflated = previousBalanceNet / dataArray[i - 1].inflationIndex;
                const balance = previousBalance * (1 + expectedProfitability);
                const balanceNet = balance * (1 - taxOnProfits);
                const inflationIndex = dataArray[i - 1].inflationIndex * (1 + expectedInflation);
                const balanceNetDeflated = balanceNet / inflationIndex;
                
                // For fixed time, we use the same withdrawal factor for all periods
                // This ensures that the balance is depleted after the specified number of periods
                const netWithdrawalDeflated = initialNetWithdrawalDeflated;
                const netWithdrawal = netWithdrawalDeflated * inflationIndex;
                const grossWithdrawal = netWithdrawal / (1 - taxOnProfits);
                const grossWithdrawalOverBalance = grossWithdrawal / balance;

                const data: PeriodData = {
                    period: i,
                    previousBalance,
                    previousBalanceNet,
                    previousBalanceNetDeflated,
                    balance,
                    balanceNet,
                    inflationIndex,
                    balanceNetDeflated,
                    netWithdrawalDeflated,
                    netWithdrawal,
                    grossWithdrawal,
                    grossWithdrawalOverBalance,
                };

                dataArray.push(data);
            }

            dataArray.push({
                period: periods + 1,
                previousBalance: dataArray[dataArray.length - 1].balance - dataArray[dataArray.length - 1].grossWithdrawal,
                previousBalanceNet: 0,
                previousBalanceNetDeflated: 0,
                balance: 0,
                balanceNet: 0,
                inflationIndex: dataArray[dataArray.length - 1].inflationIndex * (1 + expectedInflation),
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

    const balanceChartData = {
        labels: periodsData.slice(1).map(data => data.period),
        datasets: [
            {
                label: t('table.balance'),
                data: periodsData.slice(1).map(data => data.balance),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: t('table.grossWithdrawal'),
                data: periodsData.slice(1).map(data => data.grossWithdrawal),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    };

    const netDeflatedChartData = {
        labels: periodsData.slice(1).map(data => data.period),
        datasets: [
            {
                label: t('table.balanceNetDeflated'),
                data: periodsData.slice(1).map(data => data.balanceNetDeflated),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: t('table.netWithdrawalDeflated'),
                data: periodsData.slice(1).map(data => data.netWithdrawalDeflated),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('calculators.fixedTime.title')}</h1>
            
            <AmountSettings
                initialBalance={grossAmount}
                onInitialBalanceChange={(value) => handleSetAmount(value.toString(), setGrossAmount, 'grossAmount')}
                netWithdrawal={netAmount}
                onNetWithdrawalChange={(value) => handleSetAmount(value.toString(), setNetAmount, 'netAmount')}
                isNetWithdrawalDeflated={useDesiredNetWithdrawalDeflated}
                onIsNetWithdrawalDeflatedChange={(checked) => handleCheckboxChange(checked, setUseDesiredNetWithdrawalDeflated, 'useDesiredNetWithdrawalDeflated')}
            />

            <Settings
                periodDays={periodDays}
                periods={periods}
                taxOnProfits={taxOnProfits}
                expectedProfitability={expectedProfitability}
                expectedInflation={expectedInflation}
                onPeriodDaysChange={(value) => handleSetAmount(value, setPeriodDays, 'periodDays')}
                onPeriodsChange={(value) => handleSetAmount(value, setPeriods, 'periods')}
                onTaxOnProfitsChange={(value) => handleSetAmount(value, setTaxOnProfits, 'taxOnProfits')}
                onExpectedProfitabilityChange={(value) => handleSetAmount(value, setExpectedProfitability, 'expectedProfitability')}
                onExpectedInflationChange={(value) => handleSetAmount(value, setExpectedInflation, 'expectedInflation')}
            />

            <div className={styles.resultSection}>
                <h2 className={styles.title}>{t('common.results')}</h2>
                <ResultTable headers={tableHeaders} data={tableData} />
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartContainer}>
                    <h3>{t('charts.balanceAndGrossWithdrawal')}</h3>
                    <Line data={balanceChartData} />
                </div>
                <div className={styles.chartContainer}>
                    <h3>{t('charts.netDeflatedValues')}</h3>
                    <Line data={netDeflatedChartData} />
                </div>
            </div>
        </div>
    );
}

export default FixedTimeWithdrawalRetirementSimulator;