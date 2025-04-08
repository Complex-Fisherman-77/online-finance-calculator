export interface PeriodData {
    period: number;
    previousBalance: number;
    previousBalanceNet: number;
    previousBalanceNetDeflated: number;
    balance: number;
    balanceNet: number;
    inflationIndex: number;
    balanceNetDeflated: number;
    netWithdrawalDeflated: number;
    netWithdrawal: number;
    grossWithdrawal: number;
    grossWithdrawalOverBalance: number;
}

export interface FormattingOptions {
    style: string;
    currency?: string;
    minimumFractionDigits: number;
    maximumFractionDigits: number;
}

export interface LocaleFormattingOptions {
    [key: string]: FormattingOptions;
}

export interface CalculatorProps {
    initialGrossAmount?: number;
    initialNetAmount?: number;
    initialTaxOnProfits?: number;
    initialPeriodDays?: number;
    initialPeriods?: number;
    initialExpectedProfitability?: number;
    initialExpectedInflation?: number;
} 