import { useEffect, useState } from "react";
import { CustomCheckbox, InputField, ResultTable } from "../shared/components";
import "../shared/styles/calculator.css";
import "./perpetual-withdrawal-retirement-simulator.css";

function PerpetualWithdrawalRetirementSimulator() {
    const [grossAmount, setGrossAmount] = useState(1000);
    const [netAmount, setNetAmount] = useState(0);
    const [useNetAmount, setUseNetAmount] = useState(false);
    const [desiredNetWithdrawalDeflated, setDesiredNetWithdrawalDeflated] = useState(0);
    const [useDesiredNetWithdrawalDeflated, setUseDesiredNetWithdrawalDeflated] = useState(false);

    const [taxOnProfits, setTaxOnProfits] = useState(15);
    const [periodDays, setPeriodDays] = useState(252);
    const [periods, setPeriods] = useState(30);
    const [expectedProfitability, setExpectedProfitability] = useState(10);
    const [expectedInflation, setExpectedInflation] = useState(5);

    const [periodsData, setPeriodsData] = useState<any[]>([]);

    useEffect(() => {
        if (useNetAmount && netAmount > 0 && taxOnProfits > 0) {
            let newGrossAmount = netAmount / (1 - taxOnProfits / 100);
            setGrossAmount(parseFloat(newGrossAmount.toFixed(2)));
        }
    }, [useNetAmount, netAmount, taxOnProfits]);

    useEffect(() => {
        if (useDesiredNetWithdrawalDeflated && desiredNetWithdrawalDeflated > 0 && 
            taxOnProfits > 0 && expectedProfitability > 0 && expectedInflation > 0) {
            
            // Calculate the required initial balance to achieve the desired net withdrawal deflated
            // For perpetual withdrawal, we need to find the initial balance that will give us
            // the desired net withdrawal deflated in the first period
            
            // First, calculate the inflation-adjusted withdrawal rate
            const inflationAdjustedRate = (1 + expectedProfitability / 100) / (1 + expectedInflation / 100) - 1;
            
            // For perpetual withdrawal, the withdrawal rate is equal to the inflation-adjusted rate
            const withdrawalRate = inflationAdjustedRate;
            
            // Calculate the required net deflated balance
            const requiredNetDeflatedBalance = desiredNetWithdrawalDeflated / withdrawalRate;
            
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
    }, [useDesiredNetWithdrawalDeflated, desiredNetWithdrawalDeflated, taxOnProfits, expectedProfitability, expectedInflation]);

    useEffect(() => {
        if (grossAmount > 0 && taxOnProfits > 0 && periodDays > 0 && periods > 0 && expectedProfitability > 0 && expectedInflation > 0) {
            let dataArray = [];

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
                let data: any = {};
                data.period = i;
                data.previousBalance = dataArray[i - 1].balance - dataArray[i - 1].grossWithdrawal;
                data.previousBalanceNet = data.previousBalance * (1 - taxOnProfits / 100);
                data.previousBalanceNetDeflated = data.previousBalanceNet / dataArray[i - 1].inflationIndex;
                data.balance = data.previousBalance * (1 + expectedProfitability / 100);
                data.balanceNet = data.balance * (1 - taxOnProfits / 100);
                data.inflationIndex = dataArray[i - 1].inflationIndex * (1 + expectedInflation / 100);
                data.balanceNetDeflated = data.balanceNet / data.inflationIndex;
                data.netWithdrawalDeflated = data.balanceNetDeflated - data.previousBalanceNetDeflated;
                data.netWithdrawal = data.netWithdrawalDeflated * data.inflationIndex;
                data.grossWithdrawal = data.netWithdrawal / (1 - taxOnProfits / 100);
                data.grossWithdrawalOverBalance = data.grossWithdrawal / data.balance;

                dataArray.push(data);
            }

            setPeriodsData(dataArray);
        }
    }, [grossAmount, taxOnProfits, periodDays, periods, expectedProfitability, expectedInflation]);

    const handleSetAmount = (amount: string, setAmount: (amount: number) => void) => {
        setAmount(parseFloat(amount));
    };

    const tableHeaders = [
        'Period',
        'Previous Balance',
        'Previous Balance Net',
        'Previous Balance Net Deflated',
        'Balance',
        'Balance Net',
        'Inflation Index',
        'Balance Net Deflated',
        'Net Withdrawal Deflated',
        'Net Withdrawal',
        'Gross Withdrawal',
        'Gross Withdrawal / Balance'
    ];

    const tableData = periodsData.map(data => [
        data.period,
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.previousBalance),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.previousBalanceNet),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.previousBalanceNetDeflated),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.balance),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.balanceNet),
        data.inflationIndex.toFixed(4),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.balanceNetDeflated),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.netWithdrawalDeflated),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.netWithdrawal),
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.grossWithdrawal),
        new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(data.grossWithdrawalOverBalance)
    ]);

    return (
        <div className="calculator-container">
            <h1 className="calculator-title">Perpetual Withdrawal Retirement Simulator</h1>

            <div className="calculator-section">
                <h2 className="section-title">Amount Settings</h2>
                <div className="amount-section">
                    <InputField
                        label="Gross Amount"
                        value={grossAmount || ''}
                        onChange={(value) => handleSetAmount(value, setGrossAmount)}
                        type="number"
                        disabled={useNetAmount || useDesiredNetWithdrawalDeflated}
                        placeholder="Enter gross amount"
                    />
                    <CustomCheckbox
                        checked={useNetAmount}
                        onChange={setUseNetAmount}
                        label="Use Net Amount"
                        disabled={useDesiredNetWithdrawalDeflated}
                    />
                    <InputField
                        label="Net Amount"
                        value={netAmount || ''}
                        onChange={(value) => handleSetAmount(value, setNetAmount)}
                        type="number"
                        disabled={!useNetAmount || useDesiredNetWithdrawalDeflated}
                        placeholder="Enter net amount"
                    />
                    <CustomCheckbox
                        checked={useDesiredNetWithdrawalDeflated}
                        onChange={setUseDesiredNetWithdrawalDeflated}
                        label="Use Desired Net Withdrawal Deflated"
                        disabled={useNetAmount}
                    />
                    <InputField
                        label="Desired Net Withdrawal Deflated"
                        value={desiredNetWithdrawalDeflated || ''}
                        onChange={(value) => handleSetAmount(value, setDesiredNetWithdrawalDeflated)}
                        type="number"
                        disabled={!useDesiredNetWithdrawalDeflated}
                        placeholder="Enter desired net withdrawal deflated"
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

export default PerpetualWithdrawalRetirementSimulator;