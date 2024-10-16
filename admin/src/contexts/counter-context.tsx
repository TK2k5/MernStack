import React, { createContext, useContext, useState } from 'react'

type CounterContextType = {
  counter: number
  handleIncrement: () => void
  handleDecrement: () => void
}

const CounterContext = createContext<CounterContextType>({
  counter: 0,
  handleIncrement: () => {},
  handleDecrement: () => {}
})

export const CounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [counter, setCounter] = useState<number>(0)

  const handleIncrement = () => {
    setCounter((prev) => prev + 1)
  }

  const handleDecrement = () => {
    setCounter((prev) => prev - 1)
  }

  return (
    <CounterContext.Provider
      value={{
        counter,
        handleIncrement,
        handleDecrement
      }}
    >
      {children}
    </CounterContext.Provider>
  )
}

const useCounter = () => {
  const context = useContext(CounterContext)

  if (context === undefined) {
    throw new Error('useCounter must be used within a CounterProvider')
  }

  return context
}

export default useCounter
