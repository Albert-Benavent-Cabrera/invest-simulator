import { useTransition, useOptimistic } from 'react'
import { useRouter } from 'waku/router/client'
import type { IPortfolio, ITrade } from '../models/IInvest'
import {
  getPortfolio,
  updateBalance,
  buyAsset,
  sellAsset,
  clearHistory
} from '../server-actions/server'

export function usePortfolio(initialData: IPortfolio) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [optimisticPortfolio, addOptimistic] = useOptimistic(
    initialData,
    (_, nextPortfolio: IPortfolio) => nextPortfolio
  )

  const refresh = async () => {
    try {
      await getPortfolio()
    } catch (err) {
      console.error('Failed to refresh portfolio:', err)
    }
  }

  const updateBalanceHandler = async (amount: number, type: 'add' | 'remove') => {
    const newBalance = type === 'add'
      ? initialData.balance + amount
      : initialData.balance - amount

    if (newBalance < 0) throw new Error('Saldo insuficiente')

    startTransition(async () => {
      addOptimistic({ ...initialData, balance: newBalance })
      await updateBalance(amount, type)
      router.reload()
    })
  }

  const buyAssetHandler = async (trade: ITrade) => {
    const totalCost = trade.amount * trade.price

    if (totalCost > initialData.balance) {
      throw new Error('Saldo insuficiente')
    }

    const nextBalance = initialData.balance - totalCost

    startTransition(async () => {
      addOptimistic({ ...initialData, balance: nextBalance })
      try {
        await buyAsset(trade)
        router.reload()
      } catch (err) {
        console.error('buyAsset failed:', err)
        throw err
      }
    })
  }

  const sellAssetHandler = async (trade: ITrade) => {
    const existing = initialData.assets.find((a) => a.symbol === trade.symbol)
    const sellQty = trade.amount

    if (!existing || existing.amount <= 0) {
      throw new Error('No tienes esta acción')
    }
    if (sellQty > existing.amount) {
      throw new Error('No tienes suficientes acciones')
    }

    const nextBalance = initialData.balance + (sellQty * trade.price)

    startTransition(async () => {
      addOptimistic({ ...initialData, balance: nextBalance })
      try {
        await sellAsset(trade)
        router.reload()
      } catch (err) {
        console.error('sellAsset failed:', err)
        throw err
      }
    })
  }

  const clearHistoryHandler = async () => {
    startTransition(async () => {
      addOptimistic({ ...initialData, transactions: [] })
      await clearHistory()
      router.reload()
    })
  }

  return {
    portfolio: optimisticPortfolio,
    isPending,
    actions: {
      refresh,
      updateBalance: updateBalanceHandler,
      buyAsset: buyAssetHandler,
      sellAsset: sellAssetHandler,
      clearHistory: clearHistoryHandler,
    },
  }
}
