import { useEffect, useState } from "react";
import "./fixed-time-withdrawal-retirement-simulator.css";

function FixedTimeWithdrawalRetirementSimulator() {
    const [grossAmount, setGrossAmount] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const [useNetAmount, setUseNetAmount] = useState(false);

    const [taxOnProfits, setTaxOnProfits] = useState(15);
    const [periodDays, setPeriodDays] = useState(252);
    const [periods, setPeriods] = useState(30);
    const [expectedProfitability, setExpectedProfitability] = useState(10);
    const [expectedInflation, setExpectedInflation] = useState(5);

    const [periodsData, setPeriodsData] = useState<any[]>([]);

    // Add new state for input values
    const [grossAmountInput, setGrossAmountInput] = useState('');
    const [netAmountInput, setNetAmountInput] = useState('');
    const [taxInput, setTaxInput] = useState('15');
    const [profitabilityInput, setProfitabilityInput] = useState('10');
    const [inflationInput, setInflationInput] = useState('5');

    useEffect(() => {
        if (useNetAmount && netAmount > 0 && taxOnProfits > 0) {
            let newGrossAmount = netAmount / (1 - taxOnProfits / 100);
            setGrossAmount(parseFloat(newGrossAmount.toFixed(2)));
        }
    }, [useNetAmount, netAmount, taxOnProfits]);

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

    return (
        <div className="calculator-container">
            <h1 className="calculator-title">Perpetual Withdrawal Retirement Simulator</h1>

            <div className="inputs-section">
                <div className="amount-section">
                    <div className="input-group">
                        <label htmlFor="gross-amount">Gross Amount</label>
                        <input
                            type="number"
                            id="gross-amount"
                            value={grossAmount || ''}
                            onChange={e => handleSetAmount(e.target.value, setGrossAmount)}
                            disabled={useNetAmount}
                            placeholder="Enter gross amount"
                        />
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="use-net-amount"
                            checked={useNetAmount}
                            onChange={e => setUseNetAmount(!!e.target.checked)}
                        />
                        <label htmlFor="use-net-amount">Use Net Amount</label>
                    </div>
                    <div className="input-group">
                        <label htmlFor="net-amount">Net Amount</label>
                        <input
                            type="number"
                            id="net-amount"
                            value={netAmount || ''}
                            onChange={e => handleSetAmount(e.target.value, setNetAmount)}
                            disabled={!useNetAmount}
                            placeholder="Enter net amount"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="period-days">Period in Days</label>
                    <select
                        id="period-days"
                        value={periodDays}
                        onChange={e => handleSetAmount(e.target.value, setPeriodDays)}
                        disabled
                    >
                        <option value="21">21 (1 month)</option>
                        <option value="126">126 (6 months)</option>
                        <option value="252">252 (1 year)</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="periods">Number of Periods</label>
                    <input
                        type="number"
                        id="periods"
                        value={periods}
                        onChange={e => handleSetAmount(e.target.value, setPeriods)}
                        placeholder="Enter number of periods"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="tax-on-profits">Tax on Profits (%)</label>
                    <input
                        type="number"
                        id="tax-on-profits"
                        value={taxOnProfits || ''}
                        onChange={e => handleSetAmount(e.target.value, setTaxOnProfits)}
                        placeholder="Enter tax percentage"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="expected-profitability">Expected Profitability (%)</label>
                    <input
                        type="number"
                        id="expected-profitability"
                        value={expectedProfitability || ''}
                        onChange={e => handleSetAmount(e.target.value, setExpectedProfitability)}
                        placeholder="Enter expected profitability"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="expected-inflation">Expected Inflation (%)</label>
                    <input
                        type="number"
                        id="expected-inflation"
                        value={expectedInflation || ''}
                        onChange={e => handleSetAmount(e.target.value, setExpectedInflation)}
                        placeholder="Enter expected inflation"
                    />
                </div>
            </div>

            <div className="results-section">
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Previous Balance</th>
                            <th>Previous Balance Net</th>
                            <th>Previous Balance Net Deflated</th>
                            <th>Balance</th>
                            <th>Balance Net</th>
                            <th>Inflation Index</th>
                            <th>Balance Net Deflated</th>
                            <th>Net Withdrawal Deflated</th>
                            <th>Net Withdrawal</th>
                            <th>Gross Withdrawal</th>
                            <th>Gross Withdrawal / Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {periodsData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.period}</td>
                                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.previousBalance)}</td>
                                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.previousBalanceNet)}</td>
                                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.previousBalanceNetDeflated)}</td>
                                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.balance)}</td>
                                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.balanceNet)}</td>
                                <td>{data.inflationIndex.toFixed(4)}</td>
                                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.balanceNetDeflated)}</td>
                                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.netWithdrawalDeflated)}</td>
                                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.netWithdrawal)}</td>
                                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.grossWithdrawal)}</td>
                                <td>{new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(data.grossWithdrawalOverBalance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FixedTimeWithdrawalRetirementSimulator;