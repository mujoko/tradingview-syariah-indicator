import { getStorage } from '../../helper'

export async function getStorageDetails(): Promise<TSI.Flag[]> {
  try {
    const DETAILS = await getStorage('DETAILS')

    if (process.env.NODE_ENV !== 'production') {
      return DETAILS.map(i => ({
        ...i,
        updatedAt: `${Math.floor(Math.random() * 12)}/${Math.floor(Math.random() * 25)}/2021`,
      }))
    }

    console.log(DETAILS)
    return DETAILS
  } catch {
    throw new Error('Failed to get data from browser storage in popup')
  }
}

import { createSignal, createContext, useContext, Component, Accessor } from 'solid-js'

type CounterStore = [Accessor<number>, { increment?: () => void; decrement?: () => void }]

const CounterContext = createContext<CounterStore>([() => 0, {}])

export const CounterProvider: Component<{ count: number }> = props => {
  const [count, setCount] = createSignal(props.count || 0),
    store: CounterStore = [
      count,
      {
        increment() {
          setCount(c => c + 1)
        },
        decrement() {
          setCount(c => c - 1)
        },
      },
    ]

  return <CounterContext.Provider value={store}>{props.children}</CounterContext.Provider>
}

export function useCounter() {
  return useContext(CounterContext)
}
