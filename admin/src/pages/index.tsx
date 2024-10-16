/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'

import { Button } from 'antd'
import { io } from 'socket.io-client'

const HomePage = () => {
  const [socketClient, setSocketClient] = useState<any>(null)

  useEffect(() => {
    const newSocket = io('http://localhost:8080')
    setSocketClient(newSocket)
  }, [])

  // emit
  // useEffect(() => {
  //   if (!socketClient) return
  //   socketClient.emit('messengers')
  // }, [socketClient])

  useEffect(() => {
    if (!socketClient) return
    socketClient.on('send-data', (data: any) => {
      console.log('🚀 ~ socketClient.on ~ data:', data)
    })
  }, [socketClient])
  useEffect(() => {
    if (!socketClient) return
    socketClient.on('add-product', (data: any) => {
      console.log('🚀 ~ socketClient.on ~ data:', data)
    })
  }, [socketClient])

  const handleAddProduct = () => {
    const data = {
      id: 1,
      name: 'product ' + Math.round(Math.random() + 1000)
    }

    socketClient.emit('add-product', data)
  }

  return (
    <div>
      <Button onClick={handleAddProduct}>Add Product</Button>
    </div>
  )
}

export default HomePage
