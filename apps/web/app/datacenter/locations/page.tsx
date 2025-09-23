'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, FileSpreadsheet, MoreHorizontal, Download, Info, MapPin } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  memo?: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
  quantity?: number;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState({ name: '', memo: '' });
  const [loading, setLoading] = useState(true);

  // Charger les emplacements et leurs quantités depuis l'API
  useEffect(() => {
    const fetchLocationsWithQuantities = async () => {
      try {
        // Récupérer les emplacements
        const locationsResponse = await fetch('/api/locations');
        if (!locationsResponse.ok) return;
        
        const locationsData = await locationsResponse.json();
        
        // Récupérer les données de stock pour calculer les quantités
        const stockResponse = await fetch('/api/stock/items');
        if (!stockResponse.ok) {
          // Si l'API stock n'est pas disponible, utiliser des quantités par défaut
          const locationsWithQuantity = locationsData.map((loc: Location) => ({
            ...loc,
            quantity: 0
          }));
          setLocations(locationsWithQuantity);
          return;
        }
        
        const stockData = await stockResponse.json();
        
        // Calculer le nombre total d'articles par emplacement
        const locationQuantities = new Map<string, number>();
        
        stockData.forEach((product: any) => {
          product.locations.forEach((loc: any) => {
            const currentQty = locationQuantities.get(loc.locationId) || 0;
            locationQuantities.set(loc.locationId, currentQty + (loc.qty > 0 ? 1 : 0));
          });
        });
        
        // Combiner les données
        const locationsWithQuantity = locationsData.map((loc: Location) => ({
          ...loc,
          quantity: locationQuantities.get(loc.id) || 0
        }));
        
        setLocations(locationsWithQuantity);
      } catch (error) {
        console.error('Erreur lors du chargement des emplacements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationsWithQuantities();
  }, []);

  // Filtrer les emplacements selon le terme de recherche
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (location.memo && location.memo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Créer un nouvel emplacement
  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.name.trim()) return;

    // Vérifier la limite d'emplacements (simulation d'un plan Business avec 3 emplacements max)
    const MAX_LOCATIONS = 3;
    if (locations.length >= MAX_LOCATIONS) {
      alert(`Vous avez atteint la limite de ${MAX_LOCATIONS} emplacements pour votre plan actuel. Veuillez mettre à niveau votre plan pour ajouter plus d'emplacements.`);
      return;
    }

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newLocation.name,
          memo: newLocation.memo,
        }),
      });

      if (response.ok) {
        const createdLocation = await response.json();
        setLocations([...locations, { ...createdLocation, quantity: 0 }]);
        setNewLocation({ name: '', memo: '' });
        setIsModalOpen(false);
      } else if (response.status === 403) {
        alert('Vous avez atteint la limite d\'emplacements pour votre plan actuel. Veuillez mettre à niveau votre plan.');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'emplacement:', error);
    }
  };

  // Supprimer un emplacement
  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet emplacement ?')) return;

    try {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLocations(locations.filter(location => location.id !== locationId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'emplacement:', error);
    }
  };

  // Ouvrir le modal de modification
  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsEditModalOpen(true);
  };

  // Modifier un emplacement
  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation || !editingLocation.name.trim()) return;

    try {
      const response = await fetch(`/api/locations/${editingLocation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingLocation.name,
          memo: editingLocation.memo,
        }),
      });

      if (response.ok) {
        const updatedLocation = await response.json();
        setLocations(locations.map(location => 
          location.id === editingLocation.id 
            ? { ...updatedLocation, quantity: location.quantity }
            : location
        ));
        setEditingLocation(null);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'emplacement:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec icône et description */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Emplacements</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gérez vos emplacements de stockage pour organiser vos articles par lieu ou statut
            </p>
          </div>
        </div>
      </div>

      {/* Conseils d'utilisation et limites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Quand utiliser les emplacements :</p>
              <ul className="text-blue-800 space-y-1">
                <li>• <strong>Stockage physique :</strong> Entrepôt principal, Étage 3 / Étagère B, magasin</li>
                <li>• <strong>Statut des articles :</strong> Prêt à la vente, défectueux, en réparation</li>
                <li>• <strong>Gestion par équipe :</strong> Si vous avez une seule équipe, utilisez plutôt les Attributs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0">⚠️</div>
            <div className="text-sm">
              <p className="font-medium text-amber-900 mb-1">Limites du plan :</p>
              <ul className="text-amber-800 space-y-1">
                <li>• <strong>Plan Standard :</strong> 1 emplacement par défaut</li>
                <li>• <strong>Plan Business :</strong> Jusqu'à 3 emplacements inclus</li>
                <li>• <strong>Plus d'emplacements :</strong> Upgrade nécessaire</li>
              </ul>
              <a 
                href="/settings/billing" 
                className="text-amber-700 hover:text-amber-900 font-medium text-xs mt-2 inline-block"
              >
                Gérer la facturation →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Recherchez un emplacement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter un emplacement</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
            <span>Importer depuis Excel</span>
          </button>
          
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
          <Download className="w-5 h-5" />
          <span>Exporter vers Excel</span>
        </button>
      </div>

      {/* Actions rapides pour les opérations de stock */}
      {locations.length > 1 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Actions rapides</h3>
          <div className="flex flex-wrap gap-2">
            <a
              href="/stock/entrees"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
            >
              Entrées de stock
            </a>
            <a
              href="/stock/sorties"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
            >
              Sorties de stock
            </a>
            <a
              href="/stock/ajustements"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
            >
              Ajustements
            </a>
            <a
              href="/stock/transferts"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
            >
              Transferts entre emplacements
            </a>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            💡 <strong>Astuce :</strong> Les transferts entre emplacements ne sont disponibles que si vous avez au moins 2 emplacements.
          </p>
        </div>
      )}

      {/* Tableau des emplacements */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mémo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créé le
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.map((location) => (
                <tr key={location.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <a
                        href={`/datacenter/locations/${location.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {location.name}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {location.memo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {location.quantity} articles
                      </span>
                      {location.quantity > 0 && (
                        <a
                          href={`/stock/articles?location=${location.id}`}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Voir le stock
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(location.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEditLocation(location)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDeleteLocation(location.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLocations.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={5}>
                    {searchTerm ? 'Aucun emplacement trouvé' : 'Aucun emplacement créé'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout d'emplacement */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ajouter un emplacement</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  placeholder="Ex: Entrepôt principal, Magasin, Étage 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mémo
                </label>
                <textarea
                  value={newLocation.memo}
                  onChange={(e) => setNewLocation({ ...newLocation, memo: e.target.value })}
                  placeholder="Description ou notes supplémentaires..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification d'emplacement */}
      {isEditModalOpen && editingLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Modifier l'emplacement</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingLocation(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingLocation.name}
                  onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                  placeholder="Ex: Entrepôt principal, Magasin, Étage 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mémo
                </label>
                <textarea
                  value={editingLocation.memo || ''}
                  onChange={(e) => setEditingLocation({ ...editingLocation, memo: e.target.value })}
                  placeholder="Description ou notes supplémentaires..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingLocation(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
