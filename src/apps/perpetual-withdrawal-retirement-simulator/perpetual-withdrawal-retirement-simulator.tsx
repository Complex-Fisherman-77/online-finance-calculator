import { useEffect, useState } from "react";

function PerpetualWithdrawalRetirementSimulator() {
    const [grossAmount, setGrossAmount] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const [useNetAmount, setUseNetAmount] = useState(false);

    const [taxOnProfits, setTaxOnProfits] = useState(0);
    const [periodDays, setPeriodDays] = useState(252);
    const [periods, setPeriods] = useState(30);
    const [expectedProfitability, setExpectedProfitability] = useState(10);
    const [expectedInflation, setExpectedInflation] = useState(5);

    const [periodsData, setPeriodsData] = useState<any[]>([]);

    useEffect(() => {
        if (useNetAmount && netAmount > 0 && taxOnProfits > 0) {
            setGrossAmount(netAmount / (1 - taxOnProfits / 100));
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
                data.previousBalance = dataArray[i - 1].balance;
                data.previousBalanceNet = data.previousBalance * (1 - taxOnProfits / 100);
                data.previousBalanceNetDeflated = data.previousBalanceNet / dataArray[i - 1].inflationIndex;
                data.balance = dataArray[i - 1].balance * (1 + expectedProfitability / 100);
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
        const value = parseFloat(amount);
        if (!isNaN(value) && value > 0) {
            setAmount(value);
        }
    };

    return (
        <div>
            <div>
                <label htmlFor="use-net-amount">Use Net Amount?</label>
                <input type="checkbox" name="use-net-amount" checked={useNetAmount} onChange={e => setUseNetAmount(!!e.target.checked)}/>

                {useNetAmount && <>
                    <label htmlFor="net-amount">Net Amount:</label>
                    <input type="number" name="net-amount" value={netAmount} onChange={e => handleSetAmount(e.target.value, setNetAmount)}/>
                </>}

                <label htmlFor="gross-amount">Gross Amount:</label>
                <input type="number" name="gross-amount" value={grossAmount} onChange={e => handleSetAmount(e.target.value, setGrossAmount)} disabled={useNetAmount}/>
                
                <label htmlFor="tax-on-profits">Tax on Profits:</label>
                <input type="number" name="tax-on-profits" value={taxOnProfits} onChange={e => handleSetAmount(e.target.value, setTaxOnProfits)}/>

                <label htmlFor="period-days">Period in Days:</label>
                <input type="number" name="period-days" value={periodDays} onChange={e => handleSetAmount(e.target.value, setPeriodDays)}/>

                <label htmlFor="expected-profitability">Expected Profitability:</label>
                <input type="number" name="expected-profitability" value={expectedProfitability} onChange={e => handleSetAmount(e.target.value, setExpectedProfitability)}/>

                <label htmlFor="expected-inflation">Expected Inflation:</label>
                <input type="number" name="expected-inflation" value={expectedInflation} onChange={e => handleSetAmount(e.target.value, setExpectedInflation)}/>

                <label htmlFor="periods">Periods:</label>
                <input type="number" name="periods" value={periods} onChange={e => handleSetAmount(e.target.value, setPeriods)}/>
            </div>
            <div>
                <table>
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
                                {Object.entries(data).map(([key, value]) => (
                                    <td key={key}>{Number(value).toFixed(2)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PerpetualWithdrawalRetirementSimulator;