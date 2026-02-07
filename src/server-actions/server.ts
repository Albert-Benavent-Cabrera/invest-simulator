'use server'

/**
 * REORGANIZED SERVER ACTIONS
 * Central entry point that re-exports all feature actions.
 * Maintains the 'get...' naming convention for data retrieval.
 * Aliases removed to avoid 'REDECLARATION_ERROR' during build.
 */

export { getPortfolio, updateBalance } from './home/actions'
export { getQuotes, buyAsset, sellAsset } from './market/actions'
export { getBatchHistory, getHistory, clearHistory } from './history/actions'
