/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { createContext, useContext, useEffect, useState } from 'react'

import { TProduct } from '@/types/product.type'

type TProductContext = {
  products: TProduct[]
  handleCreateProduct: () => void
  handleDeleteProduct: (id: string) => void
  handleUpdateProduct: (product: TProduct) => void
}

type TProductProvider = {
  children: React.ReactNode
  data: TProduct[]
}

const ProductContext = createContext<TProductContext>({
  products: [],
  handleDeleteProduct: (id: string) => {},
  handleCreateProduct: () => {},
  handleUpdateProduct: (product: TProduct) => {}
})

export const ProductProvider = ({ children, data }: TProductProvider) => {
  const [products, setProducts] = useState<TProduct[]>([])

  // handleDeleteProduct
  const handleDeleteProduct = (id: string) => {
    const newProduct = products.filter((product) => product.id !== id)
    setProducts(newProduct)
  }

  // handleCreateProduct
  const handleCreateProduct = () => {
    const newProduct: TProduct = {
      id: '10',
      name: 'New Product',
      price: 100
    }
    setProducts([...products, newProduct])
  }

  // handleUpdateProduct
  const handleUpdateProduct = (product: TProduct) => {
    const userInfo = products.find((value) => value.id === product.id)

    if (userInfo) {
      userInfo.name = product.name + ' updated'

      const newData = products.map((p) => {
        if (p.id === product.id) {
          return userInfo
        }
        return p
      })

      setProducts(newData)
    }
  }

  useEffect(() => {
    setProducts(data)
  }, [data])

  return (
    <ProductContext.Provider value={{ products, handleDeleteProduct, handleCreateProduct, handleUpdateProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider')
  }
  return context
}
