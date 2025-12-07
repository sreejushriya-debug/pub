'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const STORE_ITEMS = [
  { id: 'teddy', name: 'Teddy Bear', price: 16.00, emoji: '🧸' },
  { id: 'basketball', name: 'Basketball', price: 15.00, emoji: '🏀' },
  { id: 'cotton', name: 'Cotton Candy', price: 5.00, emoji: '🍭' },
  { id: 'soda', name: 'Soda', price: 2.00, emoji: '🥤' },
  { id: 'chips', name: 'Chips', price: 3.00, emoji: '🍟' },
  { id: 'book', name: 'Book', price: 12.00, emoji: '📚' },
  { id: 'toy', name: 'Toy Car', price: 8.00, emoji: '🚗' },
]

interface CartItem {
  id: string
  quantity: number
}

export default function Activity52A({ onComplete }: Props) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (itemId: string) => {
    const existing = cart.find(item => item.id === itemId)
    if (existing) {
      if (existing.quantity < 3) {
        setCart(cart.map(item => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
      }
    } else {
      setCart([...cart, { id: itemId, quantity: 1 }])
    }
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + delta
        if (newQty < 1) return item
        if (newQty > 3) return item
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const cartItems = cart.map(cartItem => {
    const storeItem = STORE_ITEMS.find(i => i.id === cartItem.id)!
    return { ...storeItem, quantity: cartItem.quantity }
  })

  const canContinue = cart.length >= 3 && cart.length <= 5

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShoppingCart className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 5.2A – Build Your Cart</h2>
        </div>
        <p className="text-gray-600">Add 3-5 items to your shopping cart</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Store Shelf</h3>
          <div className="grid grid-cols-2 gap-3">
            {STORE_ITEMS.map(item => {
              const inCart = cart.find(c => c.id === item.id)
              return (
                <motion.button key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(item.id)}
                  disabled={inCart?.quantity >= 3 || cart.length >= 5}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    inCart ? 'border-forest-400 bg-forest-50' :
                    cart.length >= 5 ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' :
                    'border-gray-200 bg-white hover:border-forest-300'
                  }`}>
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-forest-600 font-semibold">${item.price.toFixed(2)}</div>
                  {inCart && <div className="text-xs text-forest-600 mt-1">In cart: {inCart.quantity}</div>}
                </motion.button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Your Cart ({cart.length} items)</h3>
          {cartItems.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add 3-5 items to continue</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">${item.price.toFixed(2)} each</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= 3}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 rounded hover:bg-red-100 text-red-500 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 mt-4">
                <div className="flex justify-between font-semibold text-forest-800">
                  <span>Cart Total:</span>
                  <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!canContinue && cart.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-sm">
            {cart.length < 3 ? `Add ${3 - cart.length} more item${3 - cart.length > 1 ? 's' : ''} to continue` : 'You can add up to 5 items total'}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <motion.button whileHover={canContinue ? { scale: 1.02 } : {}} whileTap={canContinue ? { scale: 0.98 } : {}}
          onClick={() => onComplete({ cart: cartItems })}
          disabled={!canContinue}
          className={`btn-primary px-8 py-3 ${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Continue to Receipt <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

