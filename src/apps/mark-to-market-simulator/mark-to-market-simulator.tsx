import { useState } from 'react';
import './mark-to-market-simulator.css'

type SecurityState = Partial<{
    fixedRate: number;
    postFixedRate: number;
    isIndexed: boolean;
    indexer: string;
    date: Date;
}>;

function MarkToMarketSimulator() {

    const [periods, setPeriods] = useState<number>(5);
    const [secutiryStateArray, setSecurityStateArray] = useState<SecurityState[]>([]);

    
    

    return <>
        
    </>;
}

export default MarkToMarketSimulator;