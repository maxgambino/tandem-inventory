'use client';

import { useEffect, useState } from 'react';
import { productsApi, attributesApi, Product, Attribute, ProductAttribute } from '../../../lib/api';

const RESTO_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID || 'restaurant-1';

export default function ArticlesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, attributesData] = await Promise.all([
        productsApi.getAll(),
        attributesApi.getAll(RESTO_ID)
      ]);
      setProducts(productsData);
      setAttributes(attributesData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
        <a 
          href="/datacenter/attributes"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Gérer les attributs
        </a>
      </div>

      {loading && <p className="text-sm text-gray-500">Chargement…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unité
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attributs
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.unit || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Gérer les attributs
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href="/stock/articles"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Voir le stock
                    </a>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={5}>
                    Aucun article
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de gestion des attributs */}
      {selectedProduct && (
        <ProductAttributesModal
          product={selectedProduct}
          attributes={attributes}
          onClose={() => setSelectedProduct(null)}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}

// Composant modal pour gérer les attributs d'un produit
function ProductAttributesModal({ 
  product, 
  attributes, 
  onClose, 
  onUpdate 
}: { 
  product: Product; 
  attributes: Attribute[]; 
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [productAttributes, setProductAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAttributeValues, setNewAttributeValues] = useState<Record<string, any>>({});

  const loadProductAttributes = async () => {
    try {
      const data = await attributesApi.getByProduct(product.id);
      setProductAttributes(data);
      
      // Initialiser les valeurs pour les attributs non assignés
      const existingValues: Record<string, any> = {};
      data.forEach(pa => {
        if (pa.valueText !== null) existingValues[pa.attributeId] = pa.valueText;
        if (pa.valueNumber !== null) existingValues[pa.attributeId] = pa.valueNumber;
        if (pa.valueDate !== null) existingValues[pa.attributeId] = pa.valueDate;
      });
      setNewAttributeValues(existingValues);
    } catch (error) {
      console.error('Erreur lors du chargement des attributs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProductAttributes(); }, [product.id]);

  const handleSaveAttribute = async (attributeId: string, value: any) => {
    try {
      await attributesApi.assignToProduct(attributeId, product.id, value);
      onUpdate();
      loadProductAttributes();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleRemoveAttribute = async (attributeId: string) => {
    try {
      await attributesApi.removeFromProduct(product.id, attributeId);
      onUpdate();
      loadProductAttributes();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getAttributeValue = (attributeId: string) => {
    const pa = productAttributes.find(p => p.attributeId === attributeId);
    if (pa) {
      if (pa.valueText !== null) return pa.valueText;
      if (pa.valueNumber !== null) return pa.valueNumber;
      if (pa.valueDate !== null) return pa.valueDate;
    }
    return newAttributeValues[attributeId] || '';
  };

  const renderAttributeInput = (attribute: Attribute) => {
    const value = getAttributeValue(attribute.id);
    const isAssigned = productAttributes.some(pa => pa.attributeId === attribute.id);

    switch (attribute.type) {
      case 'TEXT':
      case 'BARCODE':
        return (
          <input
            type="text"
            value={value}
            onChange={e => setNewAttributeValues(prev => ({ ...prev, [attribute.id]: e.target.value }))}
            className="border rounded px-2 py-1 w-full"
          />
        );
      case 'NUMBER':
        return (
          <input
            type="number"
            value={value}
            onChange={e => setNewAttributeValues(prev => ({ ...prev, [attribute.id]: Number(e.target.value) }))}
            className="border rounded px-2 py-1 w-full"
          />
        );
      case 'DATE':
        return (
          <input
            type="date"
            value={value}
            onChange={e => setNewAttributeValues(prev => ({ ...prev, [attribute.id]: e.target.value }))}
            className="border rounded px-2 py-1 w-full"
          />
        );
      case 'SELECTION':
        return (
          <select
            value={value}
            onChange={e => setNewAttributeValues(prev => ({ ...prev, [attribute.id]: e.target.value }))}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Sélectionner...</option>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Attributs de "{product.name}"</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Chargement…</p>
        ) : (
          <div className="space-y-4">
            {attributes.map(attribute => {
              const isAssigned = productAttributes.some(pa => pa.attributeId === attribute.id);
              
              return (
                <div key={attribute.id} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium">{attribute.name}</label>
                    <span className="text-xs text-gray-500">({attribute.type})</span>
                  </div>
                  <div className="flex gap-2">
                    {renderAttributeInput(attribute)}
                    {isAssigned ? (
                      <button
                        onClick={() => handleRemoveAttribute(attribute.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveAttribute(attribute.id, newAttributeValues[attribute.id])}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Assigner
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {attributes.length === 0 && (
              <p className="text-sm text-gray-500">Aucun attribut disponible. Créez-en dans la section Attributs.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
