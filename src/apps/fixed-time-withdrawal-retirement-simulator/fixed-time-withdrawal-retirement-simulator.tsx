import { useEffect, useState } from "react";
import { CustomCheckbox, InputField, ResultTable } from "../shared/components";
import "../shared/styles/calculator.css";
import "./fixed-time-withdrawal-retirement-simulator.css";

function FixedTimeWithdrawalRetirementSimulator() {
    const [grossAmount, setGrossAmount] = useState(1000);
    const [netAmount, setNetAmount] = useState(0);
    const [useNetAmount, setUseNetAmount] = useState(false);

    const [taxOnProfits, setTaxOnProfits] = useState(15);
    const [periodDays, setPeriodDays] = useState(252);
    const [periods, setPeriods] = useState(30);
    const [expectedProfitability, setExpectedProfitability] = useState(10);
    const [expectedInflation, setExpectedInflation] = useState(5);
    const [efectiveRate, setEfectiveRate] = useState(0);

    const [periodsData, setPeriodsData] = useState<any[]>([]);

    useEffect(() => {
        if (useNetAmount && netAmount > 0 && taxOnProfits > 0) {
            let newGrossAmount = netAmount / (1 - taxOnProfits / 100);
            setGrossAmount(parseFloat(newGrossAmount.toFixed(2)));
        }
    }, [useNetAmount, netAmount, taxOnProfits]);

    useEffect(() => {
        if (expectedProfitability > 0 && expectedInflation > 0) {
            setEfectiveRate((1 + expectedProfitability / 100) / (1 + expectedInflation / 100) - 1);
        }
    }, [expectedProfitability, expectedInflation]);

    useEffect(() => {
        if (grossAmount > 0 && taxOnProfits > 0 && periodDays > 0 && periods > 0 && expectedProfitability > 0 && expectedInflation > 0 && efectiveRate > 0) {
            let dataArray = [];

            dataArray.push({
                period: 0,
                previousBalance: 0,
                previousBalanceNet: 0,
                previousBalanceNetDeflated: 0,
                withdrawalFactor: 0,
                balance: grossAmount,
                netWithdrawalDeflated: 0,
                inflationIndex: 1,
                netWithdrawal: 0,
                grossWithdrawal: 0,
                grossWithdrawalOverBalance: 0
            });
            
            for (let i = 1; i <= periods; i++) {
                let data: any = {};
                data.period = i;
                data.previousBalance = dataArray[i - 1].balance - dataArray[i - 1].grossWithdrawal;
                data.previousBalanceNet = data.previousBalance * (1 - taxOnProfits / 100);
                data.previousBalanceNetDeflated = data.previousBalanceNet / dataArray[i - 1].inflationIndex;
                data.withdrawalFactor = efectiveRate / (1 - (1 + efectiveRate) ** -(periods - data.period + 1));
                data.balance = data.previousBalance * (1 + expectedProfitability / 100);
                data.netWithdrawalDeflated = data.previousBalanceNetDeflated * data.withdrawalFactor;
                data.inflationIndex = dataArray[i - 1].inflationIndex * (1 + expectedInflation / 100);
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
                withdrawalFactor: 0,
                balance: 0,
                netWithdrawalDeflated: 0,
                inflationIndex: dataArray[dataArray.length - 1].inflationIndex * (1 + expectedInflation / 100),
                netWithdrawal: 0,
                grossWithdrawal: 0,
                grossWithdrawalOverBalance: 0
            });

            setPeriodsData(dataArray);
        }
    }, [grossAmount, taxOnProfits, periodDays, periods, expectedProfitability, expectedInflation, efectiveRate]);

    const formatCurrency = (value: number): string => {
        if (value === 0) return '';
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const formatPercentage = (value: number): string => {
        if (value === 0) return '';
        return value.toString() + '%';
    };

    const handleSetAmount = (amount: string, setAmount: (amount: number) => void) => {
        setAmount(parseFloat(amount));
    };

    const tableHeaders = [
        'Period',
        'Previous Balance',
        'Previous Balance Net',
        'Previous Balance Net Deflated',
        'Withdrawal Factor',
        'Balance',
        'Net Withdrawal Deflated',
        'Inflation Index',
        'Net Withdrawal',
        'Gross Withdrawal',
        'Gross Withdrawal / Balance'
    ];

    const tableData = periodsData.map(data => [
        data.period,
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.previousBalance),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.previousBalanceNet),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.previousBalanceNetDeflated),
        data.withdrawalFactor.toFixed(4),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.balance),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.netWithdrawalDeflated),
        data.inflationIndex.toFixed(4),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.netWithdrawal),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.grossWithdrawal),
        new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(data.grossWithdrawalOverBalance)
    ]);

    return (
        <div className="calculator-container">
            <h1 className="calculator-title">Fixed Time Withdrawal Retirement Simulator</h1>

            <div className="calculator-section">
                <h2 className="section-title">Amount Settings</h2>
                <div className="amount-section">
                    <InputField
                        label="Gross Amount"
                        value={grossAmount || ''}
                        onChange={(value) => handleSetAmount(value, setGrossAmount)}
                        type="number"
                        disabled={useNetAmount}
                        placeholder="Enter gross amount"
                    />
                    <CustomCheckbox
                        checked={useNetAmount}
                        onChange={setUseNetAmount}
                        label="Use Net Amount"
                    />
                    <InputField
                        label="Net Amount"
                        value={netAmount || ''}
                        onChange={(value) => handleSetAmount(value, setNetAmount)}
                        type="number"
                        disabled={!useNetAmount}
                        placeholder="Enter net amount"
                    />
                </div>
            </div>

            <div className="calculator-section">
                <h2 className="section-title">Settings</h2>
                <div className="inputs-section">
                    <InputField
                        label="Period in Days"
                        value={periodDays}
                        onChange={(value) => handleSetAmount(value, setPeriodDays)}
                        type="number"
                        disabled
                        placeholder="Enter period in days"
                    />
                    <InputField
                        label="Number of Periods"
                        value={periods}
                        onChange={(value) => handleSetAmount(value, setPeriods)}
                        type="number"
                        placeholder="Enter number of periods"
                    />
                    <InputField
                        label="Tax on Profits (%)"
                        value={taxOnProfits || ''}
                        onChange={(value) => handleSetAmount(value, setTaxOnProfits)}
                        type="number"
                        placeholder="Enter tax percentage"
                    />
                    <InputField
                        label="Expected Profitability (%)"
                        value={expectedProfitability || ''}
                        onChange={(value) => handleSetAmount(value, setExpectedProfitability)}
                        type="number"
                        placeholder="Enter expected profitability"
                    />
                    <InputField
                        label="Expected Inflation (%)"
                        value={expectedInflation || ''}
                        onChange={(value) => handleSetAmount(value, setExpectedInflation)}
                        type="number"
                        placeholder="Enter expected inflation"
                    />
                </div>
            </div>

            <div className="calculator-section">
                <h2 className="section-title">Results</h2>
                <ResultTable
                    headers={tableHeaders}
                    data={tableData}
                />
            </div>
        </div>
    );
}

export default FixedTimeWithdrawalRetirementSimulator;