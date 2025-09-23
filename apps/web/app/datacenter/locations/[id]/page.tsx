'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin, Search, Plus, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  memo?: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

interface StockItem {
  id: string;
  name: string;
  sku?: string;
  unit?: string;
  locations: Array<{
    locationId: string;
    locationName: string;
    qty: number;
  }>;
  totalQty: number;
}

export default function LocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.id as string;
  
  const [location, setLocation] = useState<Location | null>(null);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        // Récupérer les détails de l'emplacement
        const locationResponse = await fetch(`/api/locations/${locationId}`);
        if (!locationResponse.ok) {
          throw new Error('Emplacement non trouvé');
        }
        const locationData = await locationResponse.json();
        setLocation(locationData);

        // Récupérer les articles en stock
        const stockResponse = await fetch('/api/stock/items');
        if (stockResponse.ok) {
          const stockData = await stockResponse.json();
          
          // Filtrer les articles qui ont du stock dans cet emplacement
          const itemsInLocation = stockData.filter((item: StockItem) => 
            item.locations.some(loc => loc.locationId === locationId && loc.qty > 0)
          );
          
          setStockItems(itemsInLocation);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (locationId) {
      fetchLocationData();
    }
  }, [locationId]);

  // Filtrer les articles selon le terme de recherche
  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculer les statistiques
  const totalItems = stockItems.length;
  const totalQuantity = stockItems.reduce((sum, item) => {
    const locationQty = item.locations.find(loc => loc.locationId === locationId)?.qty || 0;
    return sum + locationQty;
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Emplacement non trouvé'}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          <div className="flex items-center space-x-3">
            <MapPin className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{location.name}</h1>
              {location.memo && (
                <p className="text-sm text-gray-600 mt-1">{location.memo}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Articles différents</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Quantité totale</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuantity}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Emplacement créé</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(location.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Actions rapides</h3>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/stock/entrees?location=${locationId}`}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Entrée de stock
          </a>
          <a
            href={`/stock/sorties?location=${locationId}`}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
          >
            <TrendingDown className="w-4 h-4 mr-1" />
            Sortie de stock
          </a>
          <a
            href={`/stock/ajustements?location=${locationId}`}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Ajustement
          </a>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher un article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tableau des articles */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const locationQty = item.locations.find(loc => loc.locationId === locationId)?.qty || 0;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.unit || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {locationQty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalQty}
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={5}>
                    {searchTerm ? 'Aucun article trouvé' : 'Aucun article dans cet emplacement'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Informations supplémentaires */}
      {totalItems === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0">💡</div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Cet emplacement est vide</p>
              <p className="text-blue-800">
                Commencez par ajouter des articles à cet emplacement en utilisant les opérations d'entrée de stock 
                ou en transférant des articles depuis d'autres emplacements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


