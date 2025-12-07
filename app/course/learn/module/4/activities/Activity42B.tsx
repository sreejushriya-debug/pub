'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Plus, Trash2, DollarSign, AlertTriangle } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

interface Material {
  id: number
  name: string
  price: number
  quantity: number
}

export default function Activity42B({ onComplete }: Props) {
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, name: '', price: 0, quantity: 0 }
  ])
  const [nextId, setNextId] = useState(2)

  const updateMaterial = (id: number, field: keyof Material, value: string | number) => {
    setMaterials(materials.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const addMaterial = () => {
    setMaterials([...materials, { id: nextId, name: '', price: 0, quantity: 0 }])
    setNextId(prev => prev + 1)
  }

  const removeMaterial = (id: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter(m => m.id !== id))
    }
  }

  const totalCost = materials.reduce((sum, m) => sum + (m.price * m.quantity), 0)
  const hasErrors = materials.some(m => !m.name || m.price <= 0 || m.quantity <= 0)

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 4.2B – Materials & Startup Cost</h2>
        <p className="text-gray-600">List all the materials you need and their costs</p>
      </div>

      {/* Materials Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-semibold text-gray-700">
          <div className="col-span-4">Material Name</div>
          <div className="col-span-3">Price per Unit</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Line Total</div>
          <div className="col-span-1"></div>
        </div>
        {materials.map(material => {
          const lineTotal = material.price * material.quantity
          return (
            <div key={material.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center">
              <div className="col-span-4">
                <input type="text" placeholder="e.g., Flour" value={material.name}
                  onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div className="col-span-3">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">$</span>
                  <input type="number" step="0.01" placeholder="0.00" value={material.price || ''}
                    onChange={(e) => updateMaterial(material.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <input type="number" placeholder="0" value={material.quantity || ''}
                  onChange={(e) => updateMaterial(material.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-forest-600">${lineTotal.toFixed(2)}</span>
              </div>
              <div className="col-span-1">
                {materials.length > 1 && (
                  <button onClick={() => removeMaterial(material.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Material Button */}
      <div className="flex justify-end mb-4">
        <button onClick={addMaterial} className="btn-outline px-4 py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Material
        </button>
      </div>

      {/* Total */}
      <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-forest-800">Total Startup Cost:</span>
          <span className="text-2xl font-bold text-forest-600">${totalCost.toFixed(2)}</span>
        </div>
      </div>

      {hasErrors && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">Please fill in all material names, prices, and quantities.</span>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <motion.button whileHover={!hasErrors ? { scale: 1.02 } : {}} whileTap={!hasErrors ? { scale: 0.98 } : {}}
          onClick={() => onComplete({ materials, totalStartupCost: totalCost })}
          disabled={hasErrors}
          className={`btn-primary px-8 py-3 ${hasErrors ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Continue to Business Plan <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

