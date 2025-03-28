import { useEffect, useState } from "react";

function PerpetualWithdrawalRetirementSimulator() {
    const [grossAmount, setGrossAmount] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const [useNetAmount, setUseNetAmount] = useState(false);

    const [taxOnProfits, setTaxOnProfits] = useState(0);
    const [periodDays, setPeriodDays] = useState(252);
    const [expectedProfitability, setExpectedProfitability] = useState(252);
    const [expectedInflation, setExpectedInflation] = useState(252);

    useEffect(() => {
        if (useNetAmount && netAmount > 0) {
            setGrossAmount(netAmount);
        }
    }, [useNetAmount, netAmount])

    return (
        <div>
            <label htmlFor="use-net-amount">Use Net Amount?</label>
            <input type="checkbox" name="use-net-amount" checked={useNetAmount} onChange={e => setUseNetAmount(!!e.target.checked)}/>

            {useNetAmount && <>
                <label htmlFor="net-amount">Net Amount:</label>
                <input type="number" name="net-amount" value={netAmount} onChange={e => setNetAmount(parseFloat(e.target.value))}/>
            </>}

            <label htmlFor="gross-amount">Gross Amount:</label>
            <input type="number" name="gross-amount" value={grossAmount} onChange={e => setGrossAmount(parseFloat(e.target.value))} disabled={useNetAmount}/>
            
            <label htmlFor="net-amount">Net Amount:</label>
            <input type="number" name="net-amount" value={taxOnProfits} onChange={e => setTaxOnProfits(parseFloat(e.target.value))}/>

            <label htmlFor="net-amount">Net Amount:</label>
            <input type="number" name="net-amount" value={periodDays} onChange={e => setPeriodDays(parseFloat(e.target.value))}/>

            <label htmlFor="net-amount">Net Amount:</label>
            <input type="number" name="net-amount" value={expectedProfitability} onChange={e => setExpectedProfitability(parseFloat(e.target.value))}/>

            <label htmlFor="net-amount">Net Amount:</label>
            <input type="number" name="net-amount" value={expectedInflation} onChange={e => setExpectedInflation(parseFloat(e.target.value))}/>
        </div>
    );
}

export default PerpetualWithdrawalRetirementSimulator;