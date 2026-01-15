'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRole } from '../contexts/RoleContext'
import RoleSelector from '../components/RoleSelector'

interface Barcode {
  id: string
  value: string
}

type ProductStatus = 'pending' | 'approved' | 'rejected'

interface Product {
  id: string
  sku: string
  name: string
  barcodes: Barcode[]
  createdAt: string
  status: ProductStatus
  createdBy: 'receiver' | 'manager'
  approvedBy?: string
  approvedAt?: string
}

export default function ProductSetupPage() {
  const { isManager, role, canApproveProducts } = useRole()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcodes: [{ id: '1', value: '' }] as Barcode[],
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase()
    return (
      product.sku.toLowerCase().includes(query) ||
      product.name.toLowerCase().includes(query) ||
      product.barcodes.some(b => b.value.toLowerCase().includes(query))
    )
  })

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        // Simulate OCR and barcode extraction
        simulateExtraction()
      }
      reader.readAsDataURL(file)
    }
  }

  // Simulate OCR and barcode extraction (MVP placeholder)
  const simulateExtraction = () => {
    // In real implementation, this would call OCR and barcode detection APIs
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: 'Sample Product Name',
        barcodes: [
          { id: '1', value: '1234567890123' },
          { id: '2', value: '9876543210987' },
        ],
      }))
    }, 500)
  }

  // Generate SKU automatically
  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6)
    return `SKU-${timestamp}`
  }

  // Add barcode field
  const addBarcode = () => {
    setFormData(prev => ({
      ...prev,
      barcodes: [...prev.barcodes, { id: Date.now().toString(), value: '' }],
    }))
  }

  // Remove barcode field
  const removeBarcode = (id: string) => {
    setFormData(prev => ({
      ...prev,
      barcodes: prev.barcodes.filter(b => b.id !== id),
    }))
  }

  // Update barcode value
  const updateBarcode = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      barcodes: prev.barcodes.map(b => (b.id === id ? { ...b, value } : b)),
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.sku.trim()) {
      alert('Please fill in product name and SKU')
      return
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      sku: formData.sku || generateSKU(),
      name: formData.name,
      barcodes: formData.barcodes.filter(b => b.value.trim() !== ''),
      createdAt: new Date().toISOString(),
      status: isManager ? 'approved' : 'pending', // Managers auto-approve, Receivers need approval
      createdBy: role,
    }

    setProducts(prev => [...prev, newProduct])
    
    // Reset form
    setFormData({
      name: '',
      sku: '',
      barcodes: [{ id: '1', value: '' }],
    })
    setPreviewImage(null)
    setIsFormOpen(false)
  }

  // Delete product
  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  // Approve product (Manager only)
  const approveProduct = (id: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              status: 'approved' as ProductStatus,
              approvedBy: 'Manager',
              approvedAt: new Date().toISOString(),
            }
          : p
      )
    )
  }

  // Reject product (Manager only)
  const rejectProduct = (id: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: 'rejected' as ProductStatus } : p
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                  ← Back to Home
                </Link>
                <RoleSelector />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Setup
              </h1>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              + Add Product
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by SKU, name, or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">
                {products.length === 0
                  ? 'No products yet. Click "Add Product" to get started.'
                  : 'No products match your search.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Barcodes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.sku}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {product.barcodes.map((barcode) => (
                            <span
                              key={barcode.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {barcode.value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.status === 'approved'
                            ? '✅ Approved'
                            : product.status === 'pending'
                            ? '⏳ Pending'
                            : '❌ Rejected'}
                        </span>
                        {product.createdBy === 'receiver' && (
                          <p className="text-xs text-gray-500 mt-1">
                            Created by Receiver
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {product.status === 'pending' && canApproveProducts && (
                            <>
                              <button
                                onClick={() => approveProduct(product.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectProduct(product.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal - Both roles can create */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
              <button
                onClick={() => {
                  setIsFormOpen(false)
                  setPreviewImage(null)
                  setFormData({
                    name: '',
                    sku: '',
                    barcodes: [{ id: '1', value: '' }],
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Box Image
                </label>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
                    >
                      Upload Image
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
                    >
                      📷 Take Photo
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {previewImage && (
                    <div className="mt-3">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full h-48 object-contain border border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ✓ Image processed. Product name and barcodes extracted (simulated)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU / Model Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter SKU or leave empty for auto-generation"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, sku: generateSKU() }))}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                  >
                    Auto-generate
                  </button>
                </div>
              </div>

              {/* Barcodes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Barcodes
                  </label>
                  <button
                    type="button"
                    onClick={addBarcode}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Add Barcode
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.barcodes.map((barcode, index) => (
                    <div key={barcode.id} className="flex gap-2">
                      <input
                        type="text"
                        value={barcode.value}
                        onChange={(e) => updateBarcode(barcode.id, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={`Barcode ${index + 1}`}
                      />
                      {formData.barcodes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBarcode(barcode.id)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter barcode numbers visible on the product box
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false)
                    setPreviewImage(null)
                    setFormData({
                      name: '',
                      sku: '',
                      barcodes: [{ id: '1', value: '' }],
                    })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
