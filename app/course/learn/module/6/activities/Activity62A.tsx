'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingCart, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const STORE_ITEMS = [
  { id: 'notebook', name: 'Notebook', price: 3.50, isNeed: true, emoji: '📓' },
  { id: 'lunch', name: 'Lunch Food', price: 8.00, isNeed: true, emoji: '🍱' },
  { id: 'medicine', name: 'Medicine', price: 12.00, isNeed: true, emoji: '💊' },
  { id: 'supplies', name: 'School Supplies', price: 15.00, isNeed: true, emoji: '✏️' },
  { id: 'game', name: 'Video Game', price: 25.00, isNeed: false, emoji: '🎮' },
  { id: 'plushie', name: 'Plushie', price: 18.00, isNeed: false, emoji: '🧸' },
  { id: 'candy', name: 'Candy', price: 4.50, isNeed: false, emoji: '🍬' },
  { id: 'ticket', name: 'Concert Ticket', price: 35.00, isNeed: false, emoji: '🎫' },
]

const BUDGET = 50
const REQUIRED_NEEDS = ['notebook', 'lunch']

interface CartItem {
  id: string
  quantity: number
}

export default function Activity62A({ onComplete }: Props) {
  const [cart, setCart] = useState<CartItem[]>(REQUIRED_NEEDS.map(id => ({ id, quantity: 1 })))
  const [requiredNeedsMet, setRequiredNeedsMet] = useState(true)

  const addToCart = (itemId: string) => {
    const existing = cart.find(item => item.id === itemId)
    if (existing) {
      setCart(cart.map(item => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { id: itemId, quantity: 1 }])
    }
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + delta
        if (newQty < 1) return item
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeFromCart = (itemId: string) => {
    if (REQUIRED_NEEDS.includes(itemId)) return // Can't remove required needs
    setCart(cart.filter(item => item.id !== itemId))
  }

  const cartItems = cart.map(cartItem => {
    const storeItem = STORE_ITEMS.find(i => i.id === cartItem.id)!
    return { ...storeItem, quantity: cartItem.quantity }
  })

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const remaining = BUDGET - subtotal
  const hasRequiredNeeds = REQUIRED_NEEDS.every(id => cart.some(item => item.id === id))

  const canContinue = hasRequiredNeeds && subtotal > 0

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShoppingCart className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 6.2A – Build Your Shopping List</h2>
        </div>
        <p className="text-gray-600">You have ${BUDGET} to spend. You must buy a notebook and lunch food!</p>
      </div>

      <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Budget</p>
            <p className="text-2xl font-bold text-forest-600">${BUDGET}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className={`text-2xl font-bold ${subtotal > BUDGET ? 'text-red-600' : 'text-gray-900'}`}>${subtotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600' : remaining === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              ${remaining.toFixed(2)}
            </p>
          </div>
        </div>
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
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    inCart ? 'border-forest-400 bg-forest-50' :
                    item.isNeed ? 'border-blue-300 bg-blue-50' :
                    'border-gray-200 bg-white hover:border-forest-300'
                  }`}>
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-forest-600 font-semibold">${item.price.toFixed(2)}</div>
                  {item.isNeed && <div className="text-xs text-blue-600 mt-1">Need</div>}
                  {!item.isNeed && <div className="text-xs text-gray-500 mt-1">Want</div>}
                  {inCart && <div className="text-xs text-forest-600 mt-1">In cart: {inCart.quantity}</div>}
                </motion.button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Your Shopping List</h3>
          {cartItems.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Your cart is empty</p>
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
                        {item.isNeed && <div className="text-xs text-blue-600">Required Need</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded hover:bg-gray-100">
                        <Plus className="w-4 h-4" />
                      </button>
                      {!REQUIRED_NEEDS.includes(item.id) && (
                        <button onClick={() => removeFromCart(item.id)} className="p-1 rounded hover:bg-red-100 text-red-500 ml-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 mt-4">
                <div className="flex justify-between font-semibold text-forest-800">
                  <span>Subtotal (before tax):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!hasRequiredNeeds && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-sm">⚠️ You must buy a notebook and lunch food!</p>
        </div>
      )}

      <div className="flex justify-center">
        <motion.button whileHover={canContinue ? { scale: 1.02 } : {}} whileTap={canContinue ? { scale: 0.98 } : {}}
          onClick={() => onComplete({ shoppingList: cartItems })}
          disabled={!canContinue}
          className={`btn-primary px-8 py-3 ${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Continue to Tax & Discounts <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

