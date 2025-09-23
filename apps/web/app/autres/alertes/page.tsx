'use client'

import { useState } from 'react'
import { AlertTriangle, Bell, Package, TrendingDown, Clock, CheckCircle } from 'lucide-react'

interface Alert {
  id: string
  type: 'low_stock' | 'expired' | 'overdue' | 'system' | 'maintenance'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  productName?: string
  sku?: string
  currentStock?: number
  minStock?: number
  dueDate?: string
  createdAt: string
  status: 'active' | 'acknowledged' | 'resolved'
  acknowledgedBy?: string
  acknowledgedAt?: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'low_stock',
      title: 'Low Stock Alert',
      description: 'Product is running low on stock',
      severity: 'high',
      productName: 'Laptop Dell XPS 13',
      sku: 'DELL-XPS13-001',
      currentStock: 3,
      minStock: 5,
      createdAt: '2024-01-15T10:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      type: 'overdue',
      title: 'Overdue Purchase Order',
      description: 'Purchase order is overdue for delivery',
      severity: 'medium',
      dueDate: '2024-01-14',
      createdAt: '2024-01-15T09:15:00Z',
      status: 'acknowledged',
      acknowledgedBy: 'John Doe',
      acknowledgedAt: '2024-01-15T11:00:00Z'
    },
    {
      id: '3',
      type: 'system',
      title: 'System Maintenance Required',
      description: 'Scheduled system maintenance is due',
      severity: 'low',
      dueDate: '2024-01-20',
      createdAt: '2024-01-15T08:45:00Z',
      status: 'active'
    }
  ])

  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = !selectedSeverity || alert.severity === selectedSeverity
    const matchesStatus = !selectedStatus || alert.status === selectedStatus
    return matchesSeverity && matchesStatus
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800'
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Package className="h-5 w-5" />
      case 'expired':
        return <Clock className="h-5 w-5" />
      case 'overdue':
        return <TrendingDown className="h-5 w-5" />
      case 'system':
        return <Bell className="h-5 w-5" />
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const totalAlerts = alerts.length
  const activeAlerts = alerts.filter(a => a.status === 'active').length
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length
  const acknowledgedAlerts = alerts.filter(a => a.status === 'acknowledged').length

  const handleAcknowledge = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            status: 'acknowledged' as const,
            acknowledgedBy: 'Current User',
            acknowledgedAt: new Date().toISOString()
          }
        : alert
    ))
  }

  const handleResolve = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' as const }
        : alert
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-gray-600 mt-1">Monitor system alerts and important notifications</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{totalAlerts}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeAlerts}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-gray-900">{criticalAlerts}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Acknowledged</p>
                <p className="text-2xl font-bold text-gray-900">{acknowledgedAlerts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-48">
              <label className="label">Severity</label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="input"
              >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="sm:w-48">
              <label className="label">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`card p-6 border-l-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{alert.description}</p>
                    
                    {alert.productName && (
                      <div className="text-sm text-gray-500 mb-2">
                        <strong>Product:</strong> {alert.productName} ({alert.sku})
                      </div>
                    )}
                    
                    {alert.currentStock !== undefined && alert.minStock !== undefined && (
                      <div className="text-sm text-gray-500 mb-2">
                        <strong>Stock:</strong> {alert.currentStock} / {alert.minStock} (minimum)
                      </div>
                    )}
                    
                    {alert.dueDate && (
                      <div className="text-sm text-gray-500 mb-2">
                        <strong>Due Date:</strong> {new Date(alert.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      <strong>Created:</strong> {new Date(alert.createdAt).toLocaleString()}
                    </div>
                    
                    {alert.acknowledgedBy && (
                      <div className="text-sm text-gray-500 mt-1">
                        <strong>Acknowledged by:</strong> {alert.acknowledgedBy} on {new Date(alert.acknowledgedAt!).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {alert.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="btn btn-outline btn-sm"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Resolve
                      </button>
                    </>
                  )}
                  {alert.status === 'acknowledged' && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600 mb-4">
              {selectedSeverity || selectedStatus 
                ? 'Try adjusting your filter criteria.' 
                : 'Great! No alerts at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
