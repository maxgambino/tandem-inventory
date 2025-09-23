'use client'

import { useState } from 'react'
import { Plus, Search, Package, QrCode, Download, Printer } from 'lucide-react'

interface Barcode {
  id: string
  productName: string
  sku: string
  barcode: string
  type: 'EAN-13' | 'UPC-A' | 'Code-128' | 'QR Code'
  status: 'Active' | 'Inactive'
  createdAt: string
  printedCount: number
}

export default function ProductBarcodesPage() {
  const [barcodes, setBarcodes] = useState<Barcode[]>([
    {
      id: '1',
      productName: 'Laptop Dell XPS 13',
      sku: 'DELL-XPS13-001',
      barcode: '1234567890123',
      type: 'EAN-13',
      status: 'Active',
      createdAt: '2024-01-15',
      printedCount: 5
    },
    {
      id: '2',
      productName: 'Wireless Mouse',
      sku: 'MOUSE-WIRELESS-001',
      barcode: '1234567890124',
      type: 'UPC-A',
      status: 'Active',
      createdAt: '2024-01-14',
      printedCount: 12
    },
    {
      id: '3',
      productName: 'Mechanical Keyboard',
      sku: 'KEYBOARD-MECH-001',
      barcode: 'QR-123456789',
      type: 'QR Code',
      status: 'Active',
      createdAt: '2024-01-13',
      printedCount: 3
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredBarcodes = barcodes.filter(barcode =>
    barcode.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barcode.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barcode.barcode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EAN-13':
        return 'bg-blue-100 text-blue-800'
      case 'UPC-A':
        return 'bg-green-100 text-green-800'
      case 'Code-128':
        return 'bg-purple-100 text-purple-800'
      case 'QR Code':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const totalBarcodes = barcodes.length
  const activeBarcodes = barcodes.filter(b => b.status === 'Active').length
  const totalPrinted = barcodes.reduce((sum, b) => sum + b.printedCount, 0)
  const types = [...new Set(barcodes.map(b => b.type))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Barcodes</h1>
              <p className="text-gray-600 mt-1">Manage product barcodes and QR codes</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Generate Barcode
              </button>
              <button className="btn btn-outline inline-flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Bulk Download
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Barcodes</p>
                <p className="text-2xl font-bold text-gray-900">{totalBarcodes}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeBarcodes}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Printer className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Printed</p>
                <p className="text-2xl font-bold text-gray-900">{totalPrinted}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Types</p>
                <p className="text-2xl font-bold text-gray-900">{types.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search barcodes by product name, SKU, or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Barcodes Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barcode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Printed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBarcodes.map((barcode) => (
                  <tr key={barcode.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {barcode.productName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {barcode.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {barcode.barcode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(barcode.type)}`}>
                        {barcode.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(barcode.status)}`}>
                        {barcode.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {barcode.printedCount} times
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(barcode.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Printer className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredBarcodes.length === 0 && (
          <div className="text-center py-12">
            <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No barcodes found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedType 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by generating your first product barcode.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              Generate Barcode
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
