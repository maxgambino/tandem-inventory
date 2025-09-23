'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  Users, 
  ShoppingCart,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface DashboardStats {
  totalRevenue: number
  totalSales: number
  totalProducts: number
  totalCustomers: number
  revenueChange: number
  salesChange: number
  productsChange: number
  customersChange: number
}

interface RecentActivity {
  id: string
  type: 'sale' | 'purchase' | 'adjustment' | 'transfer'
  description: string
  amount?: number
  date: string
  status: 'success' | 'warning' | 'error'
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    salesChange: 0,
    productsChange: 0,
    customersChange: 0
  })

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with API calls
    setTimeout(() => {
      setStats({
        totalRevenue: 125430.50,
        totalSales: 342,
        totalProducts: 156,
        totalCustomers: 89,
        revenueChange: 12.5,
        salesChange: -3.2,
        productsChange: 8.1,
        customersChange: 15.3
      })

      setRecentActivities([
        {
          id: '1',
          type: 'sale',
          description: 'New sale: Laptop Dell XPS 13 to ABC Corporation',
          amount: 2599.98,
          date: '2024-01-15T10:30:00Z',
          status: 'success'
        },
        {
          id: '2',
          type: 'purchase',
          description: 'Stock received: 50x Wireless Mouse from TechSupply Inc.',
          amount: 799.50,
          date: '2024-01-15T09:15:00Z',
          status: 'success'
        },
        {
          id: '3',
          type: 'adjustment',
          description: 'Stock adjustment: Laptop Dell XPS 13 quantity corrected',
          date: '2024-01-15T08:45:00Z',
          status: 'warning'
        },
        {
          id: '4',
          type: 'transfer',
          description: 'Stock transfer: 5x Laptop Dell XPS 13 to Store Location A',
          date: '2024-01-14T16:20:00Z',
          status: 'success'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-blue-600" />
      case 'adjustment':
        return <Package className="h-4 w-4 text-orange-600" />
      case 'transfer':
        return <ArrowUp className="h-4 w-4 text-purple-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your business performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  {stats.revenueChange > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(stats.revenueChange)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
                <div className="flex items-center mt-1">
                  {stats.salesChange > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stats.salesChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(stats.salesChange)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <div className="flex items-center mt-1">
                  {stats.productsChange > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stats.productsChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(stats.productsChange)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                <div className="flex items-center mt-1">
                  {stats.customersChange > 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stats.customersChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(stats.customersChange)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart Placeholder */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Sales chart will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Product Categories Chart Placeholder */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Product Categories</h3>
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Distribution</span>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Category distribution chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Last 24 hours</span>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start p-4 rounded-lg border ${getActivityColor(activity.status)}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {formatDate(activity.date)}
                      </span>
                      {activity.amount && (
                        <span className="ml-2 text-xs font-medium text-gray-700">
                          {formatCurrency(activity.amount)}
                        </span>
                      )}
                    </div>
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
