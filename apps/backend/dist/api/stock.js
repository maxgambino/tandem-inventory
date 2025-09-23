import { Router } from 'express';
import { PrismaClient, MovementType } from '@prisma/client';
const prisma = new PrismaClient();
const r = Router();
/**
 * GET /api/stock/items?restaurantId=...
 * Renvoie la liste des produits + quantités par site.
 *
 * Format:
 * [
 *   {
 *     id, name, sku, unit,
 *     locations: [{ locationId, locationName, qty }],
 *     totalQty
 *   }, ...
 * ]
 */
r.get('/items', async (req, res) => {
    const restaurantId = String(req.query.restaurantId || '');
    if (!restaurantId)
        return res.status(400).json({ error: 'restaurantId requis' });
    try {
        // 1) Récupérer produits du resto
        const products = await prisma.product.findMany({
            where: { restaurantId },
            select: { id: true, name: true, sku: true, unit: true }
        });
        // 2) Récupérer sites
        const locations = await prisma.location.findMany({
            where: { restaurantId },
            select: { id: true, name: true }
        });
        // 3) Aggrégation des mouvements pour ce resto
        // On calcule la qty par (productId, locationId)
        // Règle:
        //  - IN -> +qty sur toLocationId
        //  - OUT -> -qty sur fromLocationId
        //  - ADJUSTMENT -> si toLocationId alors +qty, sinon si fromLocationId alors -qty (on n'envoie qu'un des deux)
        //  - TRANSFER -> -qty sur fromLocationId, +qty sur toLocationId
        const movements = await prisma.stockMovement.findMany({
            where: { restaurantId },
            select: {
                productId: true,
                type: true,
                quantity: true,
                fromLocationId: true,
                toLocationId: true,
            }
        });
        // 4) Construire un index qty[productId][locationId] = number
        const qtyIndex = new Map();
        const addQty = (pid, lid, delta) => {
            if (!lid)
                return;
            if (!qtyIndex.has(pid))
                qtyIndex.set(pid, new Map());
            const inner = qtyIndex.get(pid);
            inner.set(lid, (inner.get(lid) || 0) + delta);
        };
        for (const m of movements) {
            const q = Number(m.quantity);
            switch (m.type) {
                case MovementType.IN:
                    addQty(m.productId, m.toLocationId, +q);
                    break;
                case MovementType.OUT:
                    addQty(m.productId, m.fromLocationId, -q);
                    break;
                case MovementType.ADJUSTMENT:
                    // convention: si toLocationId renseigné => ajustement positif, sinon fromLocationId => négatif
                    if (m.toLocationId)
                        addQty(m.productId, m.toLocationId, +q);
                    else if (m.fromLocationId)
                        addQty(m.productId, m.fromLocationId, -q);
                    break;
                case MovementType.TRANSFER:
                    addQty(m.productId, m.fromLocationId, -q);
                    addQty(m.productId, m.toLocationId, +q);
                    break;
            }
        }
        // 5) Construire la réponse
        const data = products.map(p => {
            const perLoc = locations.map(loc => ({
                locationId: loc.id,
                locationName: loc.name,
                qty: qtyIndex.get(p.id)?.get(loc.id) || 0
            }));
            const totalQty = perLoc.reduce((s, x) => s + x.qty, 0);
            return { id: p.id, name: p.name, sku: p.sku, unit: p.unit, locations: perLoc, totalQty };
        });
        res.json(data);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du stock:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
/**
 * POST /api/stock/movements
 * body: {
 *   restaurantId: string,
 *   productId: string,
 *   type: "IN" | "OUT" | "ADJUSTMENT" | "TRANSFER",
 *   quantity: number,
 *   fromLocationId?: string,
 *   toLocationId?: string,
 *   note?: string
 * }
 */
r.post('/movements', async (req, res) => {
    try {
        const { restaurantId, productId, type, quantity, fromLocationId, toLocationId, note } = req.body || {};
        if (!restaurantId || !productId || !type || !quantity) {
            return res.status(400).json({ error: 'restaurantId, productId, type, quantity requis' });
        }
        // validation simple
        if (!['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER'].includes(type)) {
            return res.status(400).json({ error: 'type invalide' });
        }
        if (Number(quantity) <= 0) {
            return res.status(400).json({ error: 'quantity doit être > 0' });
        }
        // règles rapides de cohérence
        if (type === 'IN' && !toLocationId)
            return res.status(400).json({ error: 'toLocationId requis pour IN' });
        if (type === 'OUT' && !fromLocationId)
            return res.status(400).json({ error: 'fromLocationId requis pour OUT' });
        if (type === 'TRANSFER' && (!fromLocationId || !toLocationId)) {
            return res.status(400).json({ error: 'fromLocationId et toLocationId requis pour TRANSFER' });
        }
        // ADJUSTMENT: il faut au moins un des deux, nous utilisons 'to' pour +, 'from' pour -
        if (type === 'ADJUSTMENT' && !(fromLocationId || toLocationId)) {
            return res.status(400).json({ error: 'fromLocationId ou toLocationId requis pour ADJUSTMENT' });
        }
        const created = await prisma.stockMovement.create({
            data: {
                restaurantId,
                productId,
                type,
                quantity,
                fromLocationId: fromLocationId || null,
                toLocationId: toLocationId || null,
                note: note || null
            }
        });
        res.status(201).json(created);
    }
    catch (error) {
        console.error('Erreur lors de la création du mouvement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
export default r;
//# sourceMappingURL=stock.js.map