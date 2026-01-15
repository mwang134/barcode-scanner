'use client'

import Link from 'next/link'
import RoleSelector from './components/RoleSelector'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-end mb-6">
          <RoleSelector />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Warehouse Receiving MVP
          </h1>
          <p className="text-lg text-gray-600">
            Standalone Inventory Management System
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/product-setup"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Product Setup
            </h2>
            <p className="text-gray-600">
              Set up products with SKU and barcode mapping
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
