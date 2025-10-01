// Script pour ajouter des données de test dans Supabase
const { PrismaClient } = require('@prisma/client');

async function seedSupabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🌱 Ajout des données de test dans Supabase...');
    
    // Créer un restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name: 'Mona Verde',
        country: 'France'
      }
    });
    console.log('✅ Restaurant créé:', restaurant.name);
    
    // Créer des emplacements
    const cuisine = await prisma.location.create({
      data: {
        name: 'Cuisine',
        memo: 'Zone de préparation',
        restaurantId: restaurant.id
      }
    });
    
    const reserve = await prisma.location.create({
      data: {
        name: 'Réserve',
        memo: 'Stockage principal',
        restaurantId: restaurant.id
      }
    });
    console.log('✅ Emplacements créés');
    
    // Créer des fournisseurs
    const supplier1 = await prisma.supplier.create({
      data: {
        name: 'Fournisseur Local',
        email: 'contact@fournisseur-local.fr',
        phone: '01 23 45 67 89',
        restaurantId: restaurant.id
      }
    });
    
    const supplier2 = await prisma.supplier.create({
      data: {
        name: 'Grossiste Paris',
        email: 'commandes@grossiste-paris.fr',
        phone: '01 98 76 54 32',
        restaurantId: restaurant.id
      }
    });
    console.log('✅ Fournisseurs créés');
    
    // Créer des produits
    const tomates = await prisma.product.create({
      data: {
        name: 'Tomates fraîches',
        sku: 'TOM-001',
        barcode: '1234567890123',
        unit: 'kg',
        minStock: 5,
        restaurantId: restaurant.id,
        locationId: cuisine.id,
        supplierId: supplier1.id
      }
    });
    
    const pates = await prisma.product.create({
      data: {
        name: 'Pâtes spaghetti',
        sku: 'PAS-001',
        barcode: '2345678901234',
        unit: 'paquet',
        minStock: 10,
        restaurantId: restaurant.id,
        locationId: reserve.id,
        supplierId: supplier2.id
      }
    });
    
    const huile = await prisma.product.create({
      data: {
        name: 'Huile d\'olive extra vierge',
        sku: 'HUI-001',
        barcode: '3456789012345',
        unit: 'L',
        minStock: 3,
        restaurantId: restaurant.id,
        locationId: cuisine.id,
        supplierId: supplier1.id
      }
    });
    console.log('✅ Produits créés');
    
    // Ajouter des mouvements de stock
    await prisma.stockMovement.create({
      data: {
        restaurantId: restaurant.id,
        productId: tomates.id,
        type: 'IN',
        quantity: 20,
        toLocationId: cuisine.id,
        note: 'Réception initiale'
      }
    });
    
    await prisma.stockMovement.create({
      data: {
        restaurantId: restaurant.id,
        productId: pates.id,
        type: 'IN',
        quantity: 15,
        toLocationId: reserve.id,
        note: 'Réception initiale'
      }
    });
    
    await prisma.stockMovement.create({
      data: {
        restaurantId: restaurant.id,
        productId: huile.id,
        type: 'IN',
        quantity: 8,
        toLocationId: cuisine.id,
        note: 'Réception initiale'
      }
    });
    console.log('✅ Mouvements de stock créés');
    
    console.log('🎉 Données de test ajoutées avec succès dans Supabase !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedSupabase();


