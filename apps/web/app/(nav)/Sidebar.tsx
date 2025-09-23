'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';

type MenuItem = {
  label: string;
  href?: string;
  children?: MenuItem[];
};

const menu: MenuItem[] = [
  {
    label: 'Stock',
    children: [
      { label: 'Liste des articles', href: '/articles' },
      { label: 'Stockage (Entrées)', href: '/stock/entrees' },
      { label: 'Déstockage (Sorties)', href: '/stock/sorties' },
      { label: 'Ajustements', href: '/stock/ajustements' },
      { label: 'Déplacer le stock', href: '/stock/transferts' },
      { label: 'Transactions', href: '/transactions' },
    ],
  },
  {
    label: 'Achats & Ventes',
    children: [
      { label: 'Achats', href: '/achats/index' },
      { label: 'Ventes', href: '/ventes/index' },
      { label: 'Retours', href: '/retours/index' },
    ],
  },
  {
    label: 'Codes-barres',
    children: [
      { label: 'Imprimer Articles', href: '/codesbarres/articles' },
      { label: 'Imprimer Lots', href: '/codesbarres/lots' },
    ],
  },
  {
    label: 'Autres fonctionnalités',
    children: [
      { label: 'Alerte sur les stocks faibles', href: '/autres/alertes' },
      { label: "Lien d'inventaire", href: '/autres/lien-inventaire' },
      { label: 'Inventaire (comptages)', href: '/inventaire' },
    ],
  },
  {
    label: 'Rapports',
    children: [
      { label: 'Résumé', href: '/rapports/resume' },
      { label: 'Quantité passée', href: '/rapports/quantite-passee' },
      { label: 'Tableau de bord', href: '/rapports/tableau-de-bord' },
      { label: 'Analytique', href: '/rapports/analytique' },
      { label: 'Analyse des ventes', href: '/rapports/analyse-ventes' },
    ],
  },
  {
    label: 'Centre de données',
    children: [
      { label: 'Articles', href: '/datacenter/articles' },
      { label: 'Emplacements', href: '/datacenter/locations' },
      { label: 'Lots', href: '/datacenter/lots' },
      { label: 'Sites', href: '/datacenter/sites' },
      { label: 'Attributs', href: '/datacenter/attributes' },
      { label: 'Partenaires', href: '/datacenter/partners' },
    ],
  },
  {
    label: 'Paramètres',
    children: [
      { label: 'Équipe', href: '/params/equipe' },
      { label: 'Membres', href: '/params/membres' },
      { label: 'Notifications', href: '/params/notifications' },
      { label: 'Commandes', href: '/params/commandes' },
      { label: 'Intégrations & API', href: '/params/integrations' },
      { label: 'Facturation', href: '/params/facturation' },
    ],
  },
];

export default function Sidebar() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-72 h-screen sticky top-0 overflow-y-auto border-r bg-white p-4">
      <div className="mb-6 font-bold text-lg">Mona Verde</div>
      <nav className="space-y-2">
        {menu.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleSection(item.label)}
                  className="flex w-full items-center justify-between rounded px-3 py-2 hover:bg-gray-100 font-medium"
                >
                  <span>{item.label}</span>
                  {openSections[item.label] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {openSections[item.label] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href || '#'}
                        className="block rounded px-3 py-1 text-sm hover:bg-gray-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href || '#'}
                className="block rounded px-3 py-2 hover:bg-gray-100 font-medium"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}