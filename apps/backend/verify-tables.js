const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyTables() {
  console.log('🔍 Vérification des tables PostgreSQL...')
  
  try {
    // Vérification des restaurants
    const restaurants = await prisma.restaurant.findMany()
    console.log(`✅ Restaurants: ${restaurants.length} trouvés`)
    restaurants.forEach(r => console.log(`   • ${r.name} (${r.country || 'Pays non défini'})`))
    
    // Vérification des emplacements
    const locations = await prisma.location.findMany()
    console.log(`✅ Emplacements: ${locations.length} trouvés`)
    locations.forEach(l => console.log(`   • ${l.name}`))
    
    // Vérification des fournisseurs
    const suppliers = await prisma.supplier.findMany()
    console.log(`✅ Fournisseurs: ${suppliers.length} trouvés`)
    suppliers.forEach(s => console.log(`   • ${s.name} - ${s.email || 'Pas d\'email'}`))
    
    // Vérification des produits
    const products = await prisma.product.findMany({
      include: {
        location: true,
        supplier: true,
        restaurant: true
      }
    })
    console.log(`✅ Produits: ${products.length} trouvés`)
    products.forEach(p => {
      console.log(`   • ${p.name} (${p.sku})`)
      console.log(`     - Emplacement: ${p.location?.name || 'Non assigné'}`)
      console.log(`     - Fournisseur: ${p.supplier?.name || 'Non assigné'}`)
      console.log(`     - Restaurant: ${p.restaurant.name}`)
    })
    
    console.log('\n🎉 Toutes les tables PostgreSQL sont fonctionnelles !')
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

verifyTables()










