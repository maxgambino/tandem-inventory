'use client';

import { useEffect, useMemo, useState } from 'react';
import { stockApi, StockItem } from '@/lib/api';

// ⚠️ provisoire : fixe ton restaurantId (ou viens le chercher via contexte / user)
const RESTO_ID = process.env.NEXT_PUBLIC_RESTAURANT_ID || 'restaurant-1';

export default function StockItemsPage() {
  const [rows, setRows] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await stockApi.getItems(RESTO_ID);
      setRows(data);
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Colonnes dynamiques par site
  const locationCols = useMemo(() => {
    const set = new Map<string, string>();
    rows.forEach(r => r.locations.forEach(l => set.set(l.locationId, l.locationName)));
    return Array.from(set.entries()).map(([id, name]) => ({ id, name }));
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Liste des articles (Stock)</h1>
        <a
          href="/datacenter/articles"
          className="text-sm text-blue-600 hover:text-blue-800 underline"
          title="Gérer les fiches articles"
        >
          Gérer les fiches (Data Center)
        </a>
      </div>

      {loading && <p className="text-sm text-gray-500">Chargement…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unité
                  </th>
                  {locationCols.map(c => (
                    <th key={c.id} className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {c.name}
                    </th>
                  ))}
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {r.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {r.sku || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {r.unit || '—'}
                    </td>
                    {locationCols.map(c => {
                      const found = r.locations.find(x => x.locationId === c.id);
                      return (
                        <td key={c.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {found ? found.qty : 0}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {r.totalQty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href="/datacenter/articles"
                        className="text-blue-600 hover:text-blue-900"
                        title="Éditer la fiche"
                      >
                        Éditer fiche
                      </a>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-center text-gray-500" colSpan={4 + locationCols.length}>
                      Aucun article / Aucune donnée de stock
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
