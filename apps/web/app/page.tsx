import Link from 'next/link'
import { Package, BarChart3, Users, Settings, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Tandem</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/demarrage" className="text-gray-600 hover:text-primary-600 transition-colors">
                Getting Started
              </Link>
              <Link href="/articles" className="text-gray-600 hover:text-primary-600 transition-colors">
                Products
              </Link>
              <Link href="/stock/entrees" className="text-gray-600 hover:text-primary-600 transition-colors">
                Inventory
              </Link>
              <Link href="/rapports/tableau-de-bord" className="text-gray-600 hover:text-primary-600 transition-colors">
                Reports
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-primary-600">Tandem</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your comprehensive inventory management solution. Track products, manage stock, 
            analyze sales, and optimize your business operations with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/demarrage" 
              className="btn btn-primary btn-lg inline-flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/rapports/tableau-de-bord" 
              className="btn btn-outline btn-lg"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card p-6 text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Package className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Management</h3>
            <p className="text-gray-600 text-sm">
              Organize and track all your products with detailed information and barcode support.
            </p>
            <Link href="/articles" className="text-primary-600 text-sm font-medium mt-3 inline-block">
              Manage Products →
            </Link>
          </div>

          <div className="card p-6 text-center">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock Control</h3>
            <p className="text-gray-600 text-sm">
              Monitor inventory levels, track movements, and prevent stockouts with real-time updates.
            </p>
            <Link href="/stock/entrees" className="text-primary-600 text-sm font-medium mt-3 inline-block">
              View Stock →
            </Link>
          </div>

          <div className="card p-6 text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Management</h3>
            <p className="text-gray-600 text-sm">
              Manage your team, assign roles, and control access to different parts of the system.
            </p>
            <Link href="/params/equipe" className="text-primary-600 text-sm font-medium mt-3 inline-block">
              Manage Team →
            </Link>
          </div>

          <div className="card p-6 text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
            <p className="text-gray-600 text-sm">
              Get insights into your business with comprehensive reports and analytics.
            </p>
            <Link href="/rapports/analytique" className="text-primary-600 text-sm font-medium mt-3 inline-block">
              View Reports →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/stock/entrees" className="card p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock Entries</h3>
              <p className="text-gray-600 text-sm mb-4">Record new inventory arrivals and stock additions.</p>
              <span className="text-primary-600 text-sm font-medium">Add Stock →</span>
            </Link>
            
            <Link href="/stock/sorties" className="card p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock Exits</h3>
              <p className="text-gray-600 text-sm mb-4">Track inventory departures and stock reductions.</p>
              <span className="text-primary-600 text-sm font-medium">Record Exit →</span>
            </Link>
            
            <Link href="/inventaire" className="card p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory Count</h3>
              <p className="text-gray-600 text-sm mb-4">Perform physical inventory counts and adjustments.</p>
              <span className="text-primary-600 text-sm font-medium">Start Count →</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Tandem. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
