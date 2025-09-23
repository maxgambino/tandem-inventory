'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, PieChart, Calendar, Download, Filter } from 'lucide-react'

interface AnalyticsData {
  period: string
  revenue: number
  sales: number
  products: number
  customers: number
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const analyticsData: AnalyticsData[] = [
    { period: '2024-01-01', revenue: 12500, sales: 45, products: 156, customers: 89 },
    { period: '2024-01-02', revenue: 15200, sales: 52, products: 158, customers: 91 },
    { period: '2024-01-03', revenue: 11800, sales: 38, products: 155, customers: 87 },
    { period: '2024-01-04', revenue: 18900, sales: 67, products: 162, customers: 95 },
    { period: '2024-01-05', revenue: 22100, sales: 78, products: 165, customers: 98 },
    { period: '2024-01-06', revenue: 16700, sales: 58, products: 160, customers: 92 },
    { period: '2024-01-07', revenue: 19300, sales: 71, products: 168, customers: 101 }
  ]

  const topProducts = [
    { name: 'Laptop Dell XPS 13', sales: 45, revenue: 58499.55 },
    { name: 'Wireless Mouse', sales: 120, revenue: 3598.80 },
    { name: 'Mechanical Keyboard', sales: 78, revenue: 7019.22 },
    { name: 'Monitor 24"', sales: 32, revenue: 6399.68 },
    { name: 'USB-C Hub', sales: 89, revenue: 2671.11 }
  ]

  const topCustomers = [
    { name: 'ABC Corporation', orders: 12, revenue: 15599.88 },
    { name: 'XYZ Company', orders: 8, revenue: 8999.92 },
    { name: 'Tech Solutions Inc.', orders: 15, revenue: 12399.85 },
    { name: 'Global Systems Ltd.', orders: 6, revenue: 7199.94 },
    { name: 'Digital Partners', orders: 10, revenue: 9999.90 }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getMetricValue = (data: AnalyticsData) => {
    switch (selectedMetric) {
      case 'revenue':
        return data.revenue
      case 'sales':
        return data.sales
      case 'products':
        return data.products
      case 'customers':
        return data.customers
      default:
        return data.revenue
    }
  }

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'revenue':
        return 'Revenue'
      case 'sales':
        return 'Sales Count'
      case 'products':
        return 'Products'
      case 'customers':
        return 'Customers'
      default:
        return 'Revenue'
    }
  }

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'revenue':
        return 'text-green-600'
      case 'sales':
        return 'text-blue-600'
      case 'products':
        return 'text-purple-600'
      case 'customers':
        return 'text-orange-600'
      default:
        return 'text-green-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive business analytics and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-outline inline-flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
              <button className="btn btn-outline inline-flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-48">
              <label className="label">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <div className="sm:w-48">
              <label className="label">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="input"
              >
                <option value="revenue">Revenue</option>
                <option value="sales">Sales Count</option>
                <option value="products">Products</option>
                <option value="customers">Customers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analyticsData.reduce((sum, d) => sum + d.revenue, 0))}
                </p>
                <p className="text-sm text-green-600 mt-1">+12.5% vs last period</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.reduce((sum, d) => sum + d.sales, 0)}
                </p>
                <p className="text-sm text-green-600 mt-1">+8.3% vs last period</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(...analyticsData.map(d => d.products))}
                </p>
                <p className="text-sm text-green-600 mt-1">+5.2% vs last period</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(...analyticsData.map(d => d.customers))}
                </p>
                <p className="text-sm text-green-600 mt-1">+15.7% vs last period</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trend Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{getMetricLabel()} Trend</h3>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className={`h-12 w-12 mx-auto mb-2 ${getMetricColor()}`} />
                <p className="text-gray-500">Trend chart for {getMetricLabel().toLowerCase()}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Max: {selectedMetric === 'revenue' ? formatCurrency(Math.max(...analyticsData.map(d => getMetricValue(d)))) : Math.max(...analyticsData.map(d => getMetricValue(d)))}
                </p>
              </div>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">By revenue</span>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Category distribution chart</p>
                <p className="text-sm text-gray-400 mt-1">Electronics: 45%, Accessories: 30%, Others: 25%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <span className="text-sm text-gray-500">By revenue</span>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">#{index + 1}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
              <span className="text-sm text-gray-500">By revenue</span>
            </div>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(customer.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
