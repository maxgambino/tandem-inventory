import { fetcher } from '../../../lib/api';

export default async function DatacenterArticlesPage() {
  // Utiliser une URL complète ou désactiver le rendu statique
  const data = await fetcher('http://localhost:3001/api/datacenter/articles');

  return (
    <div>
      <h1>Datacenter Articles</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}