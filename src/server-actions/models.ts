export interface IFinanceQuote {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChangePercent?: number;
}

export interface IHistoricalQuote {
    date: Date;
    close: number | null;
}

export interface IYahooSparkResponse {
    spark: {
        result: Array<{
            symbol: string;
            response: Array<{
                meta: {
                    regularMarketPrice: number;
                    chartPreviousClose?: number;
                };
                timestamp?: number[];
                indicators?: {
                    quote: Array<{
                        close: Array<number | null>;
                    }>;
                };
            }>;
        }>;
    };
}
export interface IFinanceBatchResult {
    price: number;
    change: number;
    history: IHistoricalQuote[];
}