const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding PostgreSQL...')

  // Création du restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { id: 'restaurant-1' },
    update: {},
    create: {
      id: 'restaurant-1',
      name: 'Mona Verde',
      country: 'France',
    },
  })
  console.log('✅ Restaurant créé:', restaurant.name)

  // Création des emplacements
  const locations = await Promise.all([
    prisma.location.upsert({
      where: { id: 'location-1' },
      update: {},
      create: {
        id: 'location-1',
        name: 'Cuisine',
        restaurantId: restaurant.id,
      },
    }),
    prisma.location.upsert({
      where: { id: 'location-2' },
      update: {},
      create: {
        id: 'location-2',
        name: 'Réserve',
        restaurantId: restaurant.id,
      },
    }),
  ])
  console.log('✅ Emplacements créés:', locations.map(l => l.name).join(', '))

  // Création des fournisseurs
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { id: 'supplier-1' },
      update: {},
      create: {
        id: 'supplier-1',
        name: 'Fournisseur Local',
        email: 'contact@fournisseur-local.fr',
        phone: '01 23 45 67 89',
        restaurantId: restaurant.id,
      },
    }),
    prisma.supplier.upsert({
      where: { id: 'supplier-2' },
      update: {},
      create: {
        id: 'supplier-2',
        name: 'Grossiste Paris',
        email: 'commandes@grossiste-paris.fr',
        phone: '01 98 76 54 32',
        restaurantId: restaurant.id,
      },
    }),
  ])
  console.log('✅ Fournisseurs créés:', suppliers.map(s => s.name).join(', '))

  // Création des produits
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'product-1' },
      update: {},
      create: {
        id: 'product-1',
        name: 'Tomates fraîches',
        sku: 'TOM-001',
        barcode: '1234567890123',
        unit: 'kg',
        minStock: 5,
        restaurantId: restaurant.id,
        locationId: locations[0].id,
        supplierId: suppliers[0].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-2' },
      update: {},
      create: {
        id: 'product-2',
        name: 'Pâtes spaghetti',
        sku: 'PAS-001',
        barcode: '2345678901234',
        unit: 'paquet',
        minStock: 10,
        restaurantId: restaurant.id,
        locationId: locations[1].id,
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-3' },
      update: {},
      create: {
        id: 'product-3',
        name: 'Huile d\'olive extra vierge',
        sku: 'HUI-001',
        barcode: '3456789012345',
        unit: 'L',
        minStock: 3,
        restaurantId: restaurant.id,
        locationId: locations[0].id,
        supplierId: suppliers[0].id,
      },
    }),
  ])
  console.log('✅ Produits créés:', products.map(p => p.name).join(', '))

  console.log('🎉 Seeding PostgreSQL terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })