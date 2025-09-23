import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const r = Router();

// Liste des attributs d'un resto
r.get('/', async (req, res) => {
  try {
    const restaurantId = String(req.query.restaurantId || '');
    if (!restaurantId) return res.status(400).json({ error: 'restaurantId requis' });

    const attrs = await prisma.attribute.findMany({
      where: { restaurantId },
      include: { values: true },
      orderBy: { order: 'asc' }
    });
    res.json(attrs);
  } catch (error) {
    console.error('Erreur lors de la récupération des attributs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer attribut
r.post('/', async (req, res) => {
  try {
    const { restaurantId, name, type } = req.body;
    if (!restaurantId || !name || !type) return res.status(400).json({ error: 'Données manquantes' });

    // Trouver le prochain ordre
    const lastAttr = await prisma.attribute.findFirst({
      where: { restaurantId },
      orderBy: { order: 'desc' }
    });
    const nextOrder = (lastAttr?.order || 0) + 1;

    const created = await prisma.attribute.create({
      data: { restaurantId, name, type, order: nextOrder }
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Erreur lors de la création de l\'attribut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Associer attribut -> produit
r.post('/:attrId/assign', async (req, res) => {
  try {
    const { productId, value } = req.body;
    const attrId = req.params.attrId;
    if (!productId) return res.status(400).json({ error: 'productId requis' });

    const attr = await prisma.attribute.findUnique({ where: { id: attrId } });
    if (!attr) return res.status(404).json({ error: 'Attribut non trouvé' });

    let data: any = {};
    switch (attr.type) {
      case 'TEXT':
      case 'BARCODE':
      case 'SELECTION':
        data.valueText = String(value || '');
        break;
      case 'NUMBER':
        data.valueNumber = Number(value || 0);
        break;
      case 'DATE':
        data.valueDate = new Date(value);
        break;
    }

    const pa = await prisma.productAttribute.upsert({
      where: { productId_attributeId: { productId, attributeId: attrId } },
      update: data,
      create: { productId, attributeId: attrId, ...data }
    });

    res.json(pa);
  } catch (error) {
    console.error('Erreur lors de l\'assignation de l\'attribut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les attributs d'un produit
r.get('/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) return res.status(400).json({ error: 'productId requis' });

    const productAttrs = await prisma.productAttribute.findMany({
      where: { productId },
      include: { attribute: true }
    });

    res.json(productAttrs);
  } catch (error) {
    console.error('Erreur lors de la récupération des attributs du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un attribut d'un produit
r.delete('/product/:productId/:attrId', async (req, res) => {
  try {
    const { productId, attrId } = req.params;
    
    await prisma.productAttribute.delete({
      where: { productId_attributeId: { productId, attributeId: attrId } }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'attribut du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un attribut (et toutes ses valeurs)
r.delete('/:attrId', async (req, res) => {
  try {
    const attrId = req.params.attrId;
    
    // Supprimer d'abord toutes les valeurs associées
    await prisma.productAttribute.deleteMany({
      where: { attributeId: attrId }
    });
    
    // Puis supprimer l'attribut
    await prisma.attribute.delete({
      where: { id: attrId }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'attribut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour l'ordre des attributs
r.put('/reorder', async (req, res) => {
  try {
    const { restaurantId, attributeOrders } = req.body;
    
    if (!restaurantId || !attributeOrders || !Array.isArray(attributeOrders)) {
      return res.status(400).json({ error: 'restaurantId et attributeOrders requis' });
    }

    // Mettre à jour l'ordre de chaque attribut
    const updates = attributeOrders.map(({ id, order }: { id: string; order: number }) => 
      prisma.attribute.update({
        where: { id },
        data: { order }
      })
    );

    await Promise.all(updates);

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la réorganisation des attributs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier un attribut
r.put('/:attrId', async (req, res) => {
  try {
    const attrId = req.params.attrId;
    const { name, type } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ error: 'name et type requis' });
    }

    const updated = await prisma.attribute.update({
      where: { id: attrId },
      data: { name, type }
    });

    res.json(updated);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'attribut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default r;
