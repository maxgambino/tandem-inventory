'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, FileSpreadsheet, MoreHorizontal, Download, Info } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  memo?: string;
  quantity: number;
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [newSite, setNewSite] = useState({ name: '', memo: '' });
  const [loading, setLoading] = useState(true);

  // Charger les sites depuis l'API
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch('/api/locations');
        if (response.ok) {
          const data = await response.json();
          setSites(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des sites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  // Filtrer les sites selon le terme de recherche
  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (site.memo && site.memo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Créer un nouveau site
  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite.name.trim()) return;

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSite.name,
          memo: newSite.memo,
        }),
      });

      if (response.ok) {
        const createdSite = await response.json();
        setSites([...sites, { ...createdSite, quantity: 0 }]);
        setNewSite({ name: '', memo: '' });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors de la création du site:', error);
    }
  };

  // Supprimer un site
  const handleDeleteSite = async (siteId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) return;

    try {
      const response = await fetch(`/api/locations/${siteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSites(sites.filter(site => site.id !== siteId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du site:', error);
    }
  };

  // Ouvrir le modal de modification
  const handleEditSite = (site: Site) => {
    setEditingSite(site);
    setIsEditModalOpen(true);
  };

  // Modifier un site
  const handleUpdateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSite || !editingSite.name.trim()) return;

    try {
      const response = await fetch(`/api/locations/${editingSite.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingSite.name,
          memo: editingSite.memo,
        }),
      });

      if (response.ok) {
        const updatedSite = await response.json();
        setSites(sites.map(site => 
          site.id === editingSite.id 
            ? { ...updatedSite, quantity: site.quantity }
            : site
        ));
        setEditingSite(null);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du site:', error);
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
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">Centre de données</h1>
          <span className="text-2xl font-bold text-gray-900">Site</span>
          <Info className="w-5 h-5 text-green-500" />
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Recherchez un site"
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
            <span>Ajouter un site</span>
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

      {/* Tableau des sites */}
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
                  Quantité
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSites.map((site) => (
                <tr key={site.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {site.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {site.memo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {site.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEditSite(site)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDeleteSite(site.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout de site */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ajouter un site</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSite.name}
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  placeholder="Veuillez insérer le nom du site."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mémo
                </label>
                <textarea
                  value={newSite.memo}
                  onChange={(e) => setNewSite({ ...newSite, memo: e.target.value })}
                  placeholder="Veuillez insérer un mémo."
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

      {/* Modal de modification de site */}
      {isEditModalOpen && editingSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Modifier le site</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingSite(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingSite.name}
                  onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                  placeholder="Veuillez insérer le nom du site."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mémo
                </label>
                <textarea
                  value={editingSite.memo || ''}
                  onChange={(e) => setEditingSite({ ...editingSite, memo: e.target.value })}
                  placeholder="Veuillez insérer un mémo."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingSite(null);
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