const AppDataSource = require("../config/data-source");
const generateId = require("../middleware/generateId");
const Purchase = require("../db/entities/Purchase");
const Stock = require("../db/entities/Stock");
const Reject = require("../db/entities/Reject");

exports.receiveFromSupplier = async (req, res) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const {
            supplier_id,
            werehouse_id, // GUDANG market ID
            product_id,
            purchased_qty,
            accepted_qty,
            rejected_qty,
            reject_reason,
            price,
            batch,
            unit // 1=KG, 2=Pieces
        } = req.body;

        const userId = req.user?.id || req.body.user_id; // Dari JWT middleware

        // 1. Create Purchase record
        const purchaseId = generateId(16);
        const purchaseData = {
            id: purchaseId,
            batch: batch || null,
            qty: parseFloat(purchased_qty),
            price: parseFloat(price) || 0,
            user: userId ? { id: userId } : null,
            product: { id: product_id },
            werehouse: { id: werehouse_id },
            supplier: { id: supplier_id },
            unit: unit || '1'
        };

        const purchase = queryRunner.manager.create(Purchase, purchaseData);
        await queryRunner.manager.save(Purchase, purchase);

        // 2. Create/Update Stock record for accepted quantity
        // Cari stock gudang yang sudah ada untuk produk ini
        let existingStock = await queryRunner.manager.findOne(Stock, {
            where: {
                werehouse: { id: werehouse_id },
                product: { id: product_id },
                unit: unit || '1' // Stok dipisahkan berdasarkan satuannya
            }
        });

        if (existingStock) {
            existingStock.qty += parseFloat(accepted_qty);
            await queryRunner.manager.save(Stock, existingStock);
        } else {
            const stockId = generateId(16);
            const stockData = {
                id: stockId,
                batch: batch || null,
                qty: parseFloat(accepted_qty),
                user: userId ? { id: userId } : null,
                product: { id: product_id },
                werehouse: { id: werehouse_id },
                purchase: { id: purchaseId }, // Tautkan dengan purchase ini
                unit: unit || '1'
            };
            existingStock = queryRunner.manager.create(Stock, stockData);
            await queryRunner.manager.save(Stock, existingStock);
        }

        // 3. Create Reject record if there are rejected items
        if (parseFloat(rejected_qty) > 0) {
            // Karena relasi Reject butuh Stock ID di skema, kita pakai existingStock ID yang menerima (atau simpan dummy)
            const rejectId = generateId(16);
            const rejectData = {
                id: rejectId,
                qty: parseFloat(rejected_qty),
                desc: reject_reason || "Rejected upon receipt from supplier",
                status: '3', // 3 = other, bisa di map ke frontend
                user: userId ? { id: userId } : null,
                stock: { id: existingStock.id }, // Tautkan reject ke stok penerima
                unit: unit || '1'
            };

            const reject = queryRunner.manager.create(Reject, rejectData);
            await queryRunner.manager.save(Reject, reject);
        }

        await queryRunner.commitTransaction();

        return res.status(201).json({
            message: "Stock successfully received and validated from supplier",
            data: {
                purchaseId,
                acceptedStockId: existingStock.id
            }
        });

    } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error("Error receiving from supplier:", err);
        return res.status(500).json({ message: err.message });
    } finally {
        await queryRunner.release();
    }
};

exports.transferToMarket = async (req, res) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const {
            source_stock_id, // Dari gudang
            market_id,       // ID Market tujuan
            product_id,
            transfer_qty,
            accepted_qty,
            rejected_qty,
            reject_reason,
            unit // 1=KG, 2=Pieces
        } = req.body;

        const userId = req.user?.id || req.body.user_id;

        // 1. Reduce stock from the source (Gudang)
        const sourceStock = await queryRunner.manager.findOne(Stock, {
            where: { id: source_stock_id }
        });

        if (!sourceStock) {
            throw new Error("Source stock not found");
        }

        if (sourceStock.qty < parseFloat(transfer_qty)) {
            throw new Error("Insufficient stock in warehouse to transfer");
        }

        sourceStock.qty -= parseFloat(transfer_qty);
        await queryRunner.manager.save(Stock, sourceStock);

        // 2. Increase stock in destination (Market) for accepted quantity
        let targetStock = await queryRunner.manager.findOne(Stock, {
            where: {
                market: { id: market_id },
                product: { id: product_id },
                unit: unit || '1' // Pastikan transfer unit match
            }
        });

        if (targetStock) {
            targetStock.qty += parseFloat(accepted_qty);
            await queryRunner.manager.save(Stock, targetStock);
        } else {
            const targetStockId = generateId(16);
            const targetStockData = {
                id: targetStockId,
                qty: parseFloat(accepted_qty),
                user: userId ? { id: userId } : null,
                product: { id: product_id },
                market: { id: market_id },
                unit: unit || '1'
            };
            targetStock = queryRunner.manager.create(Stock, targetStockData);
            await queryRunner.manager.save(Stock, targetStock);
        }

        // 3. Log the rejected quantity at destination
        if (parseFloat(rejected_qty) > 0) {
            const rejectId = generateId(16);
            const rejectData = {
                id: rejectId,
                qty: parseFloat(rejected_qty),
                desc: reject_reason || "Rejected upon transfer to market",
                status: '3', // 3 = other
                user: userId ? { id: userId } : null,
                stock: { id: targetStock.id }, // Tautkan ke stok market
                unit: unit || '1'
            };

            const reject = queryRunner.manager.create(Reject, rejectData);
            await queryRunner.manager.save(Reject, reject);
        }

        await queryRunner.commitTransaction();

        return res.status(200).json({
            message: "Stock successfully transferred and validated at market",
            data: {
                sourceStockId: source_stock_id,
                targetStockId: targetStock.id
            }
        });

    } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error("Error transferring to market:", err);
        return res.status(500).json({ message: err.message });
    } finally {
        await queryRunner.release();
    }
};

exports.getInventoryDashboard = async (req, res) => {
    try {
        const stocks = await AppDataSource.getRepository(Stock).find({
            relations: ['market', 'werehouse', 'product'],
        });

        const marketData = {};

        stocks.forEach(stock => {
            let locId = "Gudang";
            let locName = "Gudang Utama";

            if (stock.market && stock.market.id) {
                locId = stock.market.id;
                locName = stock.market.name || `Market ${stock.market.id}`;
            }

            if (!marketData[locId]) {
                marketData[locId] = { marketId: locId, marketName: locName };
            }

            const productName = stock.product?.name || "Unknown Product";

            if (!marketData[locId][productName]) {
                marketData[locId][productName] = 0;
            }
            marketData[locId][productName] += stock.qty;
        });

        res.status(200).json({
            message: "Dashboard data fetched",
            data: Object.values(marketData)
        });
    } catch (err) {
        console.error("Error fetching dashboard:", err);
        res.status(500).json({ message: err.message });
    }
};
