const AppDataSource = require('../config/data-source');

// Entities / Model
const Selling = require('../db/entities/Selling');
const SellingProductDetail = require('../db/entities/SellingProductDetail');
const SellingServiceDetail = require('../db/entities/SellingServiceDetail');
const CashDrawer = require('../db/entities/CashDrawer');
const PaymentMethod = require('../db/entities/PeymentMethod');
const WeightScale = require('../db/entities/WeightScale');
const Voucher = require('../db/entities/Voucher');
const Purchase = require('../db/entities/Purchase');
const ChartItem =  require('../db/entities/CartItem');

const generateId = require('../middleware/generateId');

// Selling
exports.sellingList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Selling);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.sellingCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Selling);
    const data = repo.create(req.body);
    await repo.save(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sellingUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Selling);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    repo.merge(data, req.body);

    // 3. Save the updated entity
    const updated = await repo.save(data);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sellingDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Selling);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sellingSoftDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Selling);
    const result = await repo.softDelete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data soft-deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SellingProductDetail
exports.sellingProductDetailList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(SellingProductDetail);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.sellingProductDetailCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(SellingProductDetail);
    const data = repo.create(req.body);
    await repo.save(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sellingProductDetailUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(SellingProductDetail);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    repo.merge(data, req.body);

    // 3. Save the updated entity
    const updated = await repo.save(data);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sellingProductDetailDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(SellingProductDetail);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SellingServiceDetail
exports.sellingServiceDetailList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(SellingServiceDetail);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.sellingServiceDetailCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(SellingServiceDetail);
    const data = repo.create(req.body);
    await repo.save(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sellingServiceDetailUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(SellingServiceDetail);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    repo.merge(data, req.body);

    // 3. Save the updated entity
    const updated = await repo.save(data);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sellingServiceDetailDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(SellingServiceDetail);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CashDrawer
exports.cashDrawerList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(CashDrawer);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.cashDrawerCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(CashDrawer);
    const data = repo.create(req.body);
    await repo.save(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cashDrawerUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(CashDrawer);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    repo.merge(data, req.body);

    // 3. Save the updated entity
    const updated = await repo.save(data);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cashDrawerDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(CashDrawer);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PaymentMethod
exports.paymentMethodList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(PaymentMethod);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.paymentMethodCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(PaymentMethod);
    const data = repo.create(req.body);
    await repo.save(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.paymentMethodUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(PaymentMethod);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    repo.merge(data, req.body);

    // 3. Save the updated entity
    const updated = await repo.save(data);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.paymentMethodDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(PaymentMethod);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// WeightScale
exports.weightScaleList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(WeightScale);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.weightScaleCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(WeightScale);
    const data = repo.create(req.body);
    await repo.save(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.weightScaleUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(WeightScale);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    repo.merge(data, req.body);

    // 3. Save the updated entity
    const updated = await repo.save(data);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.weightScaleDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(WeightScale);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Voucher
exports.voucherList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Voucher);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.voucherCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Voucher);
    const data = repo.create(req.body);
    await repo.save(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.voucherUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Voucher);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    repo.merge(data, req.body);

    // 3. Save the updated entity
    const updated = await repo.save(data);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.voucherDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Voucher);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.voucherSoftDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Voucher);
    const result = await repo.softDelete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data soft-deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Purchase
exports.purchaseList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Purchase);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.purchaseById = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Purchase);
    const id = req.params.id;
    const data = await repo.findOne({
      where: {
        id
      }
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.purchaseCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Purchase);
    const id = generateId(16);
    const purchaseData = {
      id: id,
      ...req.body
    }
    const data = repo.create(purchaseData);
    await repo.save(data);

    return res.status(201).json({
      message: "Purchase created successfully",
      data: data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.purchaseUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Purchase);
    const id = req.params.id;
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    const updated = repo.merge(data, req.body);
    await repo.save(updated);
    return res.status(200).json({
      message: "Purchase updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.purchaseDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Purchase);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ChartItem
exports.chartItemList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(ChartItem);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.chartItemCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(ChartItem);
    const data = repo.create(req.body);
    await repo.save(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.chartItemUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(ChartItem);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    repo.merge(data, req.body);

    // 3. Save the updated entity
    const updated = await repo.save(data);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.chartItemDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(ChartItem);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};