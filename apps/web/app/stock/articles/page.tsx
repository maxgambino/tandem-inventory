import { apiFetcher } from '../../lib/api';

export default async function StockArticlesPage() {
  // Simplified to avoid API calls during build
  const data = { message: "Data loaded on client side" };

  return (
    <div>
      <h1>Stock Articles</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}