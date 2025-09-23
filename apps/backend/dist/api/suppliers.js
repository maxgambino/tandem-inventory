import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const r = Router();
// GET all suppliers
r.get('/', async (_req, res) => {
    const suppliers = await prisma.supplier.findMany({
        include: { restaurant: true }
    });
    res.json(suppliers);
});
// POST create supplier
r.post('/', async (req, res) => {
    const { name, email, phone, restaurantId } = req.body;
    const supplier = await prisma.supplier.create({
        data: { name, email, phone, restaurantId }
    });
    res.status(201).json(supplier);
});
export default r;
//# sourceMappingURL=suppliers.js.map