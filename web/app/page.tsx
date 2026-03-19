const USD_TO_INR = 83;

type Product = {
  id: number;
  name: string;
  priceUsd: number;
  category: string;
};

const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', priceUsd: 89.99, category: 'Electronics' },
  { id: 2, name: 'Classic Cotton T-Shirt', priceUsd: 24.99, category: 'Clothing' },
  { id: 3, name: 'Programming Guide Book', priceUsd: 39.99, category: 'Books' },
  { id: 4, name: 'Stainless Steel Coffee Maker', priceUsd: 79.99, category: 'Home & Kitchen' },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="font-semibold mb-2">{p.name}</h2>
            <p className="text-sm text-gray-500 mb-1">{p.category}</p>
            <p className="text-lg font-bold">
              ?{Math.round(p.priceUsd * USD_TO_INR).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-400">(${p.priceUsd.toFixed(2)})</p>
          </div>
        ))}
      </div>
    </main>
  );
}

