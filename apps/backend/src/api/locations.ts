import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const r = Router();

// GET all locations
r.get('/', async (_req, res) => {
  try {
    const locations = await prisma.location.findMany({
      include: { restaurant: true }
    });
    res.json(locations);
  } catch (error) {
    console.error('Erreur lors de la récupération des locations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET location by ID
r.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const location = await prisma.location.findUnique({
      where: { id },
      include: { restaurant: true }
    });
    
    if (!location) {
      return res.status(404).json({ error: 'Location non trouvée' });
    }
    
    res.json(location);
  } catch (error) {
    console.error('Erreur lors de la récupération de la location:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create location
r.post('/', async (req, res) => {
  try {
    const { name, memo, restaurantId } = req.body;
    
    // Pour l'instant, on utilise un restaurant par défaut
    // Dans un vrai projet, vous devriez récupérer l'ID du restaurant depuis l'authentification
    const defaultRestaurant = await prisma.restaurant.findFirst();
    if (!defaultRestaurant) {
      return res.status(400).json({ error: 'Aucun restaurant trouvé' });
    }

    const location = await prisma.location.create({
      data: { 
        name, 
        memo: memo || null,
        restaurantId: restaurantId || defaultRestaurant.id
      }
    });
    res.status(201).json(location);
  } catch (error) {
    console.error('Erreur lors de la création de la location:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE location
r.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la location existe
    const location = await prisma.location.findUnique({
      where: { id }
    });
    
    if (!location) {
      return res.status(404).json({ error: 'Location non trouvée' });
    }

    // Supprimer la location
    await prisma.location.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Location supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la location:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT update location
r.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, memo } = req.body;
    
    const location = await prisma.location.update({
      where: { id },
      data: { name, memo: memo || null }
    });
    
    res.json(location);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la location:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default r;