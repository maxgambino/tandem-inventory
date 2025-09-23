import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const r = Router();

// GET all products
r.get('/', async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { supplier: true, location: true }
  });
  res.json(products);
});

// GET one product
r.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { supplier: true, location: true }
  });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

// POST create product
r.post('/', async (req, res) => {
  const { name, sku, barcode, unit, restaurantId, locationId, supplierId } = req.body;
  const product = await prisma.product.create({
    data: { name, sku, barcode, unit, restaurantId, locationId, supplierId }
  });
  res.status(201).json(product);
});

export default r;