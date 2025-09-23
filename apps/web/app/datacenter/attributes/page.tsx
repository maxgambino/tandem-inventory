'use client';

import { useEffect, useState } from 'react';

type Attribute = {
  id: string;
  name: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'BARCODE' | 'SELECTION';
  order: number;
  createdAt: string;
  values: any[];
};

const API = process.env.NEXT_PUBLIC_API_URL!;
const RESTO_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID!;

export default function AttributesPage() {
  const [attrs, setAttrs] = useState<Attribute[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<'TEXT'|'NUMBER'|'DATE'|'BARCODE'|'SELECTION'>('TEXT');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [editingAttr, setEditingAttr] = useState<Attribute | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/attributes?restaurantId=${RESTO_ID}`);
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setAttrs(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const url = editingAttr 
        ? `${API}/attributes/${editingAttr.id}`
        : `${API}/attributes`;
      const method = editingAttr ? 'PUT' : 'POST';
      
      const body = editingAttr
        ? { name: name.trim(), type }
        : { restaurantId: RESTO_ID, name: name.trim(), type };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) throw new Error(editingAttr ? 'Erreur de modification' : 'Erreur de création');
      
      setName('');
      setEditingAttr(null);
      setShowAddForm(false);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (attr: Attribute) => {
    setEditingAttr(attr);
    setName(attr.name);
    setType(attr.type);
    setShowAddForm(false);
  };

  const handleDelete = async (attrId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet attribut ? Cette action supprimera également toutes les valeurs associées aux produits.')) {
      return;
    }
    
    try {
      const res = await fetch(`${API}/attributes/${attrId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Erreur de suppression');
      
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCancel = () => {
    setEditingAttr(null);
    setName('');
    setType('TEXT');
    setShowAddForm(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingAttr(null);
    setName('');
    setType('TEXT');
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Créer une nouvelle liste avec les éléments réorganisés
    const newAttrs = [...attrs];
    const draggedItem = newAttrs[draggedIndex];
    
    // Supprimer l'élément de sa position originale
    newAttrs.splice(draggedIndex, 1);
    
    // Insérer l'élément à sa nouvelle position
    newAttrs.splice(dropIndex, 0, draggedItem);

    // Mettre à jour l'ordre dans la base de données
    try {
      const attributeOrders = newAttrs.map((attr, index) => ({
        id: attr.id,
        order: index + 1
      }));

      await fetch(`${API}/attributes/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          restaurantId: RESTO_ID, 
          attributeOrders 
        })
      });

      // Mettre à jour l'état local
      setAttrs(newAttrs.map((attr, index) => ({ ...attr, order: index + 1 })));
    } catch (error) {
      console.error('Erreur lors de la réorganisation:', error);
      setError('Erreur lors de la réorganisation');
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TEXT': return 'Texte';
      case 'NUMBER': return 'Nombre';
      case 'DATE': return 'Date';
      case 'BARCODE': return 'Code-barres';
      case 'SELECTION': return 'Sélection';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">Centre de données</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Attribut</h1>
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">Chargement des attributs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white">
            {/* Liste des attributs */}
            <div className="space-y-0 mb-8">
              {attrs.map((attr, index) => (
                <div 
                  key={attr.id} 
                  className={`flex items-center justify-between py-4 border-b border-gray-100 transition-colors ${
                    draggedIndex === index ? 'opacity-50' : ''
                  } ${
                    dragOverIndex === index ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  draggable={editingAttr?.id !== attr.id}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div 
                      className={`text-gray-400 cursor-grab hover:text-gray-600 transition-colors ${
                        editingAttr?.id === attr.id ? 'cursor-default' : ''
                      }`}
                      title={editingAttr?.id === attr.id ? '' : 'Glisser pour réorganiser'}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      {editingAttr?.id === attr.id ? (
                        <div className="flex items-center gap-4">
                          <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 flex-1"
                          />
                          <select
                            value={type}
                            onChange={e => setType(e.target.value as any)}
                            className="border border-gray-300 rounded px-3 py-1"
                          >
                            <option value="SELECTION">Sélection</option>
                            <option value="TEXT">Texte</option>
                            <option value="NUMBER">Nombre</option>
                            <option value="DATE">Date</option>
                            <option value="BARCODE">Code-barres</option>
                          </select>
                          <button
                            onClick={() => onSubmit({ preventDefault: () => {} } as any)}
                            disabled={isSubmitting || !name.trim()}
                            className="text-blue-600 hover:text-blue-800 disabled:opacity-50 px-2"
                          >
                            {isSubmitting ? '...' : '✓'}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-800 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-8">
                          <span className="font-medium text-gray-900">{attr.name}</span>
                          <span className="text-gray-500">{getTypeLabel(attr.type)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {editingAttr?.id !== attr.id && (
                    <button
                      onClick={() => handleDelete(attr.id)}
                      className="text-gray-400 hover:text-red-600 px-2"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
              
              {attrs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Aucun attribut créé
                </div>
              )}
            </div>

            {/* Bouton d'ajout */}
            {!showAddForm && !editingAttr && (
              <div className="flex justify-center">
                <button
                  onClick={handleAddClick}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-gray-700 font-medium">Ajouter</span>
                </button>
              </div>
            )}

            {/* Formulaire d'ajout */}
            {showAddForm && (
              <div className="bg-gray-50 rounded-lg p-6">
                <form onSubmit={onSubmit} className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Par ex. : taille, couleur, fabricant..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="w-48">
                    <select
                      value={type}
                      onChange={e => setType(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="SELECTION">Sélection</option>
                      <option value="TEXT">Texte</option>
                      <option value="NUMBER">Nombre</option>
                      <option value="DATE">Date</option>
                      <option value="BARCODE">Code-barres</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!name.trim() || isSubmitting}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}