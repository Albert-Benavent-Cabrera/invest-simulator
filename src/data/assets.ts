export interface IAssetDef {
  id: string;
  name: string;
  symbol: string;
  type: 'crypto' | 'stock' | 'index' | 'bank';
  subtype?: 'account' | 'deposit'; // New field to distinguish
  fixedPrice?: number;
  tae?: number;
  minAmount?: number;
  maxAmount?: number;
  term?: string;
  conditions?: string;
  url?: string;
}

export const ASSET_DEFS: IAssetDef[] = [
  // Mercado
  { id: '1', name: 'Bitcoin', symbol: 'BTC-EUR', type: 'crypto' },
  { id: '2', name: 'Apple Inc.', symbol: 'AAPL', type: 'stock' },
  { id: '3', name: 'S&P 500', symbol: '^GSPC', type: 'index' },
  { id: '4', name: 'Nike', symbol: 'NKE', type: 'stock' },
  { id: '5', name: 'Monster Energy', symbol: 'MNST', type: 'stock' },
  { id: '6', name: 'Coca-Cola', symbol: 'KO', type: 'stock' },

  // ═══════════════════════════════════════════════════════════════════
  // CUENTAS REMUNERADAS SIN CONDICIONES - Actualizado 30 enero 2026
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'b1', name: 'Renault Bank', symbol: 'RENAULT', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 2.02, term: 'Sin plazo',
    url: 'https://renaultbank.es/productos/'
  },
  {
    id: 'b2', name: 'Trade Republic', symbol: 'TRADE', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 2.02, term: 'Sin plazo',
    conditions: 'Dinero en cuenta colectiva banco asociado',
    url: 'https://traderepublic.com/es-es/interes'
  },
  {
    id: 'b3', name: 'Cajamar', symbol: 'CAJAMAR', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.76, term: 'Sin plazo', maxAmount: 50000,
    conditions: '1.00% a partir de 50k€',
    url: 'https://www.grupocooperativocajamar.es/'
  },
  {
    id: 'b4', name: 'Cetelem', symbol: 'CETELEM', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.75, term: 'Sin plazo',
    conditions: '2.10% nuevos clientes 1 año',
    url: 'https://www.cetelem.es/cuenta-ahorro-cetelem'
  },
  {
    id: 'b5', name: 'B100 (Abanca)', symbol: 'B100', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.75, term: 'Sin plazo', maxAmount: 50000,
    url: 'https://b100.es/es/banco/cuentas/cuenta-online/'
  },
  {
    id: 'b6', name: 'Pibank', symbol: 'PIBANK', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.51, term: 'Sin plazo',
    url: 'https://www.pibank.es/cuenta-remunerada/'
  },
  {
    id: 'b7', name: 'Banco BiG', symbol: 'BIG', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.51, term: 'Sin plazo',
    url: 'https://www.bancobig.es/cuentas-big/'
  },
  {
    id: 'b8', name: 'Banco Pichincha', symbol: 'PICHINCHA', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.51, term: 'Sin plazo',
    url: 'https://www.bancopichincha.es/particulares/cuenta-ahorro'
  },
  {
    id: 'b9', name: 'Indexa Capital', symbol: 'INDEXA', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.50, term: 'Sin plazo', minAmount: 20000,
    conditions: 'BCE - 0.50%',
    url: 'https://indexacapital.com/es/esp/yield'
  },
  {
    id: 'b10', name: 'Revolut', symbol: 'REVOLUT', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.25, term: 'Sin plazo',
    conditions: '2.27% con plan Ultra (55€/mes)',
    url: 'https://www.revolut.com/es-ES/instant-access-savings/'
  },
  {
    id: 'b11', name: 'Wizink', symbol: 'WIZINK', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.20, term: 'Sin plazo',
    url: 'https://www.wizink.es/public/productos/cuenta-ahorro'
  },
  {
    id: 'b12', name: 'Self Bank', symbol: 'SELF', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.00, term: 'Sin plazo', maxAmount: 60000,
    conditions: '1.50% con 20k€ en fondos/ETFs',
    url: 'https://www.selfbank.es/ahorrar/cuenta-ahorro-self'
  },
  {
    id: 'b13', name: 'EBN Banco', symbol: 'EBN', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 1.00, term: 'Sin plazo', maxAmount: 50000, minAmount: 3000,
    conditions: 'Saldo medio trimestral >3k€',
    url: 'https://www.ebnbanco.com/ahorro/cuenta-remunerada-ahorro/'
  },
  {
    id: 'b14', name: 'N26', symbol: 'N26', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 0.50, term: 'Sin plazo',
    conditions: '1.30% con plan Metal (16.90€/mes)',
    url: 'https://n26.com/es-es/cuenta-ahorro'
  },
  {
    id: 'b15', name: 'ING', symbol: 'ING', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 0.30, term: 'Sin plazo',
    conditions: '1.00% domiciliando nómina',
    url: 'https://www.ing.es/cuenta-naranja'
  },
  {
    id: 'b16', name: 'MyInvestor', symbol: 'MYI', type: 'bank', subtype: 'account',
    fixedPrice: 1, tae: 0.30, term: 'Sin plazo', maxAmount: 70000,
    conditions: '0.75% nuevos clientes 1 año',
    url: 'https://myinvestor.es/cuentas-tarjetas/cuentas/'
  },

  // ═══════════════════════════════════════════════════════════════════
  // DEPÓSITOS CON CONDICIONES
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'd1', name: 'Banco BiG', symbol: 'BIG_DEP', type: 'bank', subtype: 'deposit',
    fixedPrice: 1, tae: 4.00, term: '1 meses',
    conditions: 'Nuevos clientes. 3.00% a 3m, 2.50% a 6m.',
    url: 'https://www.bancobig.es/ahorrar/depositos-a-plazo-fijo/'
  },
  {
    id: 'd2', name: 'MyInvestor', symbol: 'MYI_DEP', type: 'bank', subtype: 'deposit',
    fixedPrice: 1, tae: 4.00, term: '1 meses', maxAmount: 20000,
    conditions: 'Con Plan Premium. O sin plan: 2.25% invirtiendo 150€/mes.',
    url: 'https://myinvestor.es/cuentas-tarjetas/depositos/'
  },
  {
    id: 'd3', name: 'Openbank', symbol: 'OPEN_DEP', type: 'bank', subtype: 'deposit',
    fixedPrice: 1, tae: 3.03, term: '3 meses',
    conditions: 'Con nómina >900€. Si no: 2.02%. O 2.78% a 4 meses.',
    url: 'https://www.openbank.es/deposito-a-plazo-fijo'
  },
  {
    id: 'd4', name: 'Deutsche Bank', symbol: 'DB_DEP', type: 'bank', subtype: 'deposit',
    fixedPrice: 1, tae: 3.00, term: '12 meses',
    conditions: 'Con nómina (2% base + 0.40% nomina + extras tarjeta/fondo)',
    url: 'https://www.deutsche-bank.es/es/soluciones-particulares/ahorro-inversion/depositos/deposito-confianza.html'
  },
  {
    id: 'd5', name: 'ING', symbol: 'ING_DEP', type: 'bank', subtype: 'deposit',
    fixedPrice: 1, tae: 3.00, term: '3 meses',
    conditions: 'Solo nuevos clientes.',
    url: 'https://www.ing.es/cuenta-naranja'
  },
  {
    id: 'd6', name: 'CBNK', symbol: 'CBNK_DEP', type: 'bank', subtype: 'deposit',
    fixedPrice: 1, tae: 2.50, term: '12 meses', minAmount: 10000,
    conditions: 'Nómina >2k€ o 10k€ fondos pensiones.',
    url: 'https://cbnk.es/personas/depositos/deposito-nomina'
  },
  {
    id: 'd7', name: 'Arquia Banca', symbol: 'ARQ_DEP', type: 'bank', subtype: 'deposit',
    fixedPrice: 1, tae: 2.50, term: '6 meses', minAmount: 10000, maxAmount: 30000,
    conditions: 'Nómina >900€ O Fondo >10k€ O Seguro Salud.',
    url: 'https://www.arquia.com/es-es/depositos/deposito-verdad-cuenta/'
  },
  {
    id: 'd8', name: 'Banca March', symbol: 'MARCH_DEP', type: 'bank', subtype: 'deposit',
    fixedPrice: 1, tae: 2.10, term: '12 meses', minAmount: 30000,
    conditions: 'Nuevos clientes. 2.01% a 6 meses.',
    url: 'https://avantio.bancamarch.es/es/cuentas/deposito-12-meses/'
  },
  {
    id: 'd9', name: 'Caixabank', symbol: 'CAIXA_DEP', type: 'bank', subtype: 'deposit',
    fixedPrice: 1, tae: 1.10, term: '12 meses', minAmount: 5000,
    conditions: 'Contratando productos vinculados.',
    url: 'https://www.caixabank.es/particular/ahorro/deposito-plazo-fijo.html'
  }
];

export const MARKET_SYMBOLS = ASSET_DEFS
  .filter(a => a.type !== 'bank')
  .map(a => a.symbol);
