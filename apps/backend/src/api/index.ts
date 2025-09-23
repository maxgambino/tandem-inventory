import { Router } from 'express';
import products from './products.js';
import locations from './locations.js';
import suppliers from './suppliers.js';
import stock from './stock.js';
import attributes from './attributes.js';

// Tu ajouteras ici au fur et à mesure : achats, ventes, transferts, etc.

const router = Router();

router.use('/products', products);
router.use('/locations', locations);
router.use('/suppliers', suppliers);
router.use('/stock', stock);
router.use('/attributes', attributes);

// Endpoint "ping" des modules pour vérifier wiring
router.get('/', (_req, res) => {
  res.json({
    modules: [
      'products', 'locations', 'suppliers', 'attributes',
      'stock-in','stock-out','adjustments','transfers',
      'transactions','purchases','sales','returns',
      'barcodes','alerts','inventory','reports',
      'datacenter','params'
    ]
  });
});

export default router;