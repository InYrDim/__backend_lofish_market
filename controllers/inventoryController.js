const AppDataSource = require("../config/data-source");
const generateId = require("../middleware/generateId");
const Purchase = require("../db/entities/Purchase");
const Stock = require("../db/entities/Stock");
const Reject = require("../db/entities/Reject");
const Product = require("../db/entities/Product");
const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), "upload");
const rejectDir = path.join(baseDir, "reject");

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

        // 0. Validate Unit against Product Config
        const product = await queryRunner.manager.findOne(Product, { where: { id: product_id } });
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.unit !== (unit || '1')) {
            const error = new Error(`Gagal menyimpan. Satuan ukur tidak cocok dengan profil produk asal (${product.unit === '1' ? 'KG' : 'Ekor/Pcs'}).`);
            error.statusCode = 400;
            throw error;
        }

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
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ message: err.message });
    } finally {
        await queryRunner.release();
    }
};

exports.receiveBulkFromSupplier = async (req, res) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const {
            supplier_id,
            werehouse_id, // GUDANG market ID
            items // array of { product_id, purchased_qty, accepted_qty, rejected_qty, reject_reason, price, batch, unit }
        } = req.body;

        const userId = req.user?.id || req.body.user_id;

        if (!items || !Array.isArray(items) || items.length === 0) {
            const error = new Error("Items array is required and cannot be empty.");
            error.statusCode = 400;
            throw error;
        }

        const purchaseIds = [];
        const acceptedStockIds = [];

        for (const item of items) {
            const {
                product_id,
                purchased_qty,
                accepted_qty,
                rejected_qty,
                reject_reason,
                price,
                batch,
                unit
            } = item;

            // 0. Validate Unit against Product Config
            const product = await queryRunner.manager.findOne(Product, { where: { id: product_id } });
            if (!product) {
                const error = new Error(`Product with ID ${product_id} not found`);
                error.statusCode = 404;
                throw error;
            }
            if (product.unit !== (unit || '1')) {
                const error = new Error(`Gagal menyimpan "${product.name}". Satuan ukur tidak cocok dengan profil produk asal (${product.unit === '1' ? 'KG' : 'Ekor/Pcs'}).`);
                error.statusCode = 400;
                throw error;
            }

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
            purchaseIds.push(purchaseId);

            // 2. Create/Update Stock record for accepted quantity
            let existingStock = await queryRunner.manager.findOne(Stock, {
                where: {
                    werehouse: { id: werehouse_id },
                    product: { id: product_id },
                    unit: unit || '1'
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
                    purchase: { id: purchaseId },
                    unit: unit || '1'
                };
                existingStock = queryRunner.manager.create(Stock, stockData);
                await queryRunner.manager.save(Stock, existingStock);
            }
            acceptedStockIds.push(existingStock.id);

            // 3. Create Reject record if there are rejected items
            if (parseFloat(rejected_qty) > 0) {
                const rejectId = generateId(16);
                const rejectData = {
                    id: rejectId,
                    qty: parseFloat(rejected_qty),
                    desc: reject_reason || "Rejected upon bulk receipt from supplier",
                    status: '3', // 3 = other
                    user: userId ? { id: userId } : null,
                    stock: { id: existingStock.id },
                    unit: unit || '1'
                };

                const reject = queryRunner.manager.create(Reject, rejectData);
                await queryRunner.manager.save(Reject, reject);
            }
        }

        await queryRunner.commitTransaction();

        return res.status(201).json({
            message: "Bulk stock successfully received and validated from supplier",
            data: {
                purchaseIds,
                acceptedStockIds
            }
        });

    } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error("Error receiving bulk from supplier:", err);
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ message: err.message });
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

        // 0. Validate Unit against Product Config
        const product = await queryRunner.manager.findOne(Product, { where: { id: product_id } });
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.unit !== (unit || '1')) {
            const error = new Error(`Gagal mentransfer. Satuan ukur tidak cocok dengan profil produk asal (${product.unit === '1' ? 'KG' : 'Ekor/Pcs'}).`);
            error.statusCode = 400;
            throw error;
        }

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
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ message: err.message });
    } finally {
        await queryRunner.release();
    }
};

exports.getInventoryDashboard = async (req, res) => {
    try {
        const userRole = req.user?.role;
        const userMarketId = req.user?.market_id;
        console.log("=== req.user ===", req.user);

        // Roles that see only their own outlet
        const outletScopedRoles = ['SPVR', 'GDNG', 'KSR', 'TMBG'];
        const isOutletScoped = outletScopedRoles.includes(userRole);

        let where = {};
        if (isOutletScoped && userMarketId) {
            // Supervisor/Gudang/Kasir: only see their assigned outlet's stock
            where = [
                { market: { id: userMarketId } },
                { werehouse: { id: userMarketId } },
            ];
        }
        // Admin/Manager: no filter — see all stock

        const stockRepo = AppDataSource.getRepository(Stock);
        const stocks = isOutletScoped && userMarketId
            ? await stockRepo.find({
                where,
                relations: ['market', 'werehouse', 'product'],
              })
            : await stockRepo.find({
                relations: ['market', 'werehouse', 'product'],
              });

        const marketData = {};

        stocks.forEach(stock => {
            let locId = "Gudang";
            let locName = "Gudang Utama";

            if (stock.market && stock.market.id) {
                locId = stock.market.id;
                locName = stock.market.name || `Market ${stock.market.id}`;
            } else if (stock.werehouse && stock.werehouse.id) {
                locId = stock.werehouse.id;
                locName = stock.werehouse.name || 'Gudang Utama';
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
            data: Object.values(marketData),
            // Let frontend know if this is scoped or full view
            scoped: isOutletScoped,
            market_id: userMarketId || null,
        });
    } catch (err) {
        console.error("Error fetching dashboard:", err);
        res.status(500).json({ message: err.message });
    }
};


exports.requestReject = async (req, res, next) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const {
            market_id,
            product_id,
            qty,
            desc,
            unit
        } = req.body;

        console.log("=== requestReject payload ===", req.body);

        const userId = req.user?.id;
        const parsedMarketId = market_id === 'null' || market_id === 'undefined' ? null : market_id;
        const targetMarketId = parsedMarketId || req.user?.market_id;

        if (!targetMarketId) {
            const error = new Error("Market ID is required");
            error.statusCode = 400;
            throw error;
        }

        // Find the stock
        const stock = await queryRunner.manager.findOne(Stock, {
            where: [
                { market: { id: targetMarketId }, product: { id: product_id }, unit: unit || '1' },
                { werehouse: { id: targetMarketId }, product: { id: product_id }, unit: unit || '1' }
            ]
        });

        if (!stock) {
            const error = new Error("Stock not found for this product and market");
            error.statusCode = 404;
            throw error;
        }

        const rejectId = generateId(16);
        let fileName = null;

        // Handle image upload
        if (req.file) {
            if (!fs.existsSync(rejectDir)) {
                fs.mkdirSync(rejectDir, { recursive: true });
            }
            const fileExtension = path.extname(req.file.originalname);
            fileName = `${rejectId}${fileExtension}`;
            const filePath = path.join(rejectDir, fileName);
            fs.writeFileSync(filePath, req.file.buffer);
        }

        const rejectData = {
            id: rejectId,
            qty: parseFloat(qty),
            desc: desc || "Reject requested",
            status: '3', // 3 = other
            unit: unit || '1',
            approval_status: 'PENDING',
            image_proof: fileName,
            user: userId ? { id: userId } : null,
            stock: { id: stock.id }
        };

        const reject = queryRunner.manager.create(Reject, rejectData);
        await queryRunner.manager.save(Reject, reject);

        await queryRunner.commitTransaction();

        return res.status(201).json({
            message: "Reject request submitted successfully",
            data: reject
        });

    } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error("Error requesting reject:", err);
        if (next) return next(err);
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ message: err.message });
    } finally {
        await queryRunner.release();
    }
};

exports.getRejectList = async (req, res, next) => {
    try {
        const userRole = req.user?.role;
        const userMarketId = req.user?.market_id;

        const outletScopedRoles = ['SPVR', 'GDNG', 'KSR', 'TMBG'];
        const isOutletScoped = outletScopedRoles.includes(userRole);

        let where = {};
        if (isOutletScoped && userMarketId) {
            where = [
                { stock: { market: { id: userMarketId } } },
                { stock: { werehouse: { id: userMarketId } } }
            ];
        }

        const rejectRepo = AppDataSource.getRepository(Reject);
        const rejects = await rejectRepo.find({
            where,
            relations: ['user', 'approved_by', 'stock', 'stock.product', 'stock.market', 'stock.werehouse'],
            order: { created_at: 'DESC' }
        });

        return res.status(200).json({
            message: "Reject list fetched successfully",
            data: rejects
        });
    } catch (err) {
        console.error("Error fetching reject list:", err);
        if (next) return next(err);
        return res.status(500).json({ message: err.message });
    }
};

exports.approveReject = async (req, res, next) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const { id } = req.params;
        const { action } = req.body; // 'APPROVED' or 'REJECTED'

        if (!['APPROVED', 'REJECTED'].includes(action)) {
            const error = new Error("Invalid action. Must be APPROVED or REJECTED");
            error.statusCode = 400;
            throw error;
        }

        const userId = req.user?.id;

        const reject = await queryRunner.manager.findOne(Reject, {
            where: { id },
            relations: ['stock']
        });

        if (!reject) {
            const error = new Error("Reject record not found");
            error.statusCode = 404;
            throw error;
        }

        if (reject.approval_status !== 'PENDING') {
            const error = new Error(`Reject is already ${reject.approval_status}`);
            error.statusCode = 400;
            throw error;
        }

        reject.approval_status = action;
        reject.approved_by = { id: userId };

        if (action === 'APPROVED') {
            const stock = reject.stock;
            if (!stock) {
                const error = new Error("Related stock not found");
                error.statusCode = 404;
                throw error;
            }

            if (stock.qty < reject.qty) {
                const error = new Error("Insufficient stock to approve this reject");
                error.statusCode = 400;
                throw error;
            }

            stock.qty -= reject.qty;
            await queryRunner.manager.save(Stock, stock);
        }

        await queryRunner.manager.save(Reject, reject);

        await queryRunner.commitTransaction();

        return res.status(200).json({
            message: `Reject request ${action.toLowerCase()} successfully`,
            data: reject
        });

    } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error("Error approving reject:", err);
        if (next) return next(err);
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ message: err.message });
    } finally {
        await queryRunner.release();
    }
};

exports.getPurchaseHistory = async (req, res, next) => {
    try {
        const purchaseRepo = AppDataSource.getRepository(Purchase);
        
        // Fetch last 100 purchases for time-series chart
        const purchases = await purchaseRepo.find({
            relations: ['product', 'supplier', 'werehouse'],
            order: { created_at: 'DESC' },
            take: 100
        });

        return res.status(200).json({
            message: "Purchase history fetched successfully",
            data: purchases
        });
    } catch (err) {
        console.error("Error fetching purchase history:", err);
        if (next) return next(err);
        return res.status(500).json({ message: err.message });
    }
};