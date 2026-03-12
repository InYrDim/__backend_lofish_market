const AppDataSource = require('../config/data-source');

// Entities / Model
const User = require('../db/entities/User');
const Member = require('../db/entities/Member');
const Session = require('../db/entities/Session');
const Role = require('../db/entities/Role');
const Permission = require('../db/entities/Permission');
const Supplier = require('../db/entities/Supplier');
const HasPermit = require('../db/entities/HasPermit');

const generateId = require('../middleware/generateId');

// User
exports.userList = async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.createQueryBuilder('user')
    .leftJoinAndSelect('user.role', 'role')
    .leftJoinAndSelect('user.market', 'market')
    .select([
        'user.id',
        'user.name',
        'user.username',
        'user.email',
        'role.id',
        'role.name',
        'role.guard_name',
        'market.id',
        'market.name'
    ])
    .getMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.userById = async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const id = req.params.id;
    const data = await userRepo.createQueryBuilder('user')
    .leftJoinAndSelect('user.role', 'role')
    .select([
      'user.id', 
      'user.username', 
      'user.email', 
      'role.id', 
      'role.name',
      'role.guard_name'
    ])
    .where('user.id = :id', { id: id }) // Menambahkan kondisi WHERE yang spesifik ke user.id
    .getOne();
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.userCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(User);
    const id = generateId(8);
    const { market_id, ...rest } = req.body;
    const createData = {
      id: id,
      ...rest
    }
    if (market_id) {
      createData.market = { id: market_id };
    }
    const data = repo.create(createData);
    await repo.save(data);

    return res.status(201).json({
      message: "User created successfully",
      data: data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.userUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(User);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    const { market_id, ...rest } = req.body;
    const updateData = { ...rest };
    if (market_id) {
      updateData.market = { id: market_id };
    }
    const updated = repo.merge(data, updateData);

    // 3. Save the updated entity
    await repo.save(updated);

    return res.status(200).json({ // Gunakan status 200 untuk update yang berhasil
      message: "User updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.userDelete = async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const result = await userRepo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.userSoftDelete = async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const result = await userRepo.softDelete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User soft-deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Member
exports.memberList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Member);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.memberById = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Member);
    const id = req.params.id;
    const data = await repo.findOne({
      where: {
        id
      }
    });
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.memberCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Member);
    const id = generateId(10);
    const createData = {
      id: id,
      ...req.body
    }
    const data = repo.create(createData);
    await repo.save(data);

    return res.status(201).json({
      message: "Member created successfully",
      data: data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.memberUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Member);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    const updated = repo.merge(data, req.body);

    // 3. Save the updated entity
    await repo.save(updated);

    return res.status(200).json({ // Gunakan status 200 untuk update yang berhasil
      message: "Member updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.memberDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Member);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.memberSoftDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Member);
    const result = await repo.softDelete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member soft-deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Session

exports.sessionShow = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Session);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.sessionList = async () => {
  try {
    const repo = AppDataSource.getRepository(Session);
    const data = await repo.find();
    return data;
  } catch (err) {
    throw err;
  }
};

exports.sessionById = async (id) => {
  try {
    const repo = AppDataSource.getRepository(Session);
    const data = await repo.findOne({
      where: {
        id
      },
      order: {
        // Mengurutkan berdasarkan kolom 'created_at' secara menurun (Descending)
        // Ini memastikan entitas dengan created_at terbaru berada di urutan teratas.
        created_at: 'DESC' 
      }
    });
    return data;
  } catch (err) {
    // Melempar error agar ditangani oleh fungsi pemanggil (middleware/controller)
    throw err;
  }
};

exports.sessionCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Session);
    const create = repo.create(req.body);
    await repo.save(create);
    res.json(create);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sessionUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Session);
    const id = req.params.id;

    // 1. Find existing
    const session = await repo.findOne({ where: { id } });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // 2. Merge request body to entity
    repo.merge(session, req.body);

    // 3. Save the updated entity
    const updated = await repo.save(session);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sessionDelete = async (id) => {
  try {
    const repo = AppDataSource.getRepository(Session);
    const result = await repo.delete(id);

    if (result.affected === 0) {
      const error = new Error("Session not found.");
      error.status = 500;
      throw error;
    }

    return result.affected;
  } catch (err) {
    throw err;
  }
};

exports.sessionDeleteExpired = async () => {
  try {
    const repo = AppDataSource.getRepository(Session);
    const currentTime = new Date(); // Ambil waktu saat ini

    // Gunakan QueryBuilder untuk menghapus banyak baris berdasarkan kondisi
    const result = await repo.createQueryBuilder()
      .delete() // Tentukan operasi DELETE
      .from(Session) // Tentukan entitas target
      // Tentukan kondisi WHERE: Hapus jika expired_at kurang dari waktu saat ini
      .where("expired_at < :currentTime", { currentTime })
      .execute(); // Jalankan query

    console.log(`Pembersihan sesi selesai. ${result.affected} sesi kedaluwarsa dihapus.`);
    
    // Kembalikan jumlah baris yang terpengaruh (dihapus)
    return { 
      message: 'Expired sessions cleaned up successfully.', 
      deletedCount: result.affected 
    };
    
  } catch (err) {
    // Lempar error agar ditangani oleh fungsi pemanggil atau sistem logging
    throw new Error("Gagal menghapus sesi yang kedaluwarsa."); 
  }
};

// Role
exports.roleList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Role);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.roleById = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Role);
    const id = req.params.id;
    const data = await repo.findOne({
      where: {
        id
      }
    });
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.roleCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Role);
    const id = generateId(4);
    const createData = {
      id: id,
      ...req.body
    }
    const data = repo.create(createData);
    await repo.save(data);

    return res.status(201).json({
      message: "Role created successfully",
      data: data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.roleUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Role);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    const updated = repo.merge(data, req.body);

    // 3. Save the updated entity
    await repo.save(updated);

    return res.status(200).json({ // Gunakan status 200 untuk update yang berhasil
      message: "Role updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.roleDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Role);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Permission
exports.permissionList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Permission);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.permissionById = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Permission);
    const id = req.params.id;
    const data = await repo.findOne({
      where: {
        id
      }
    });
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.permissionCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Permission);
    const id = generateId(4);
    
    const bodyData = {
      id: id,
      ...req.body
    };

    const data = repo.create(bodyData);
    await repo.save(data);

    return res.status(201).json({
      message: "Permission created successfully",
      data: data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.permissionUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Permission);
    const id = req.params.id;

    // 1. Find existing
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // 2. Merge request body to entity
    const updated = repo.merge(data, req.body);

    // 3. Save the updated entity
    await repo.save(updated);

    return res.status(200).json({ // Gunakan status 200 untuk update yang berhasil
      message: "Permission updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.permissionDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Permission);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    res.json({ message: 'Permission deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supplier
exports.supplierList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Supplier);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.supplierById = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Supplier);
    const id = req.params.id;
    const data = await repo.findOne({
      where: {
        id
      }
    });
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.supplierCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Supplier);
    const id = generateId(8);
    const supplierData = {
      id: id,
      ...req.body
    }
    const data = repo.create(supplierData);
    await repo.save(data);

    return res.status(201).json({
      message: "Supplier created successfully",
      data: data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.supplierUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Supplier);
    const id = req.params.id;
    const data = await repo.findOne({ where: { id } });

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    const updated = repo.merge(data, req.body);
    await repo.save(updated);
    return res.status(200).json({
      message: "Supplier updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.supplierDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Supplier);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.supplierSoftDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Supplier);
    const result = await repo.softDelete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier soft-deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// HasPermit
exports.hasPermitList = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(HasPermit);
    const data = await repo.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.hasPermitById = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(HasPermit);
    const id = req.params.id;
    const data = await repo.findOne({
      where: {
        id
      }
    });
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.hasPermitEdit = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(HasPermit);

    const { role, hasPermit } = req.body;

    // buat array of rows
    const rows = hasPermit.map(permitId => ({
      id: generateId(8),
      role,
      permission: permitId
    }));

    // delete sebelum create
    await repo.delete({ role: req.body.role });


    // create banyak row sekaligus
    const created = repo.create(rows);

    // save sekaligus
    await repo.save(created);

    return res.status(200).json({
      message: "Has Permit edited successfully",
      data: rows
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.hasPermitCreate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(HasPermit);
    const create = repo.create(req.body);
    await repo.save(create);
    res.json(create);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.hasPermitUpdate = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(HasPermit);
    const id = req.params.id;

    // 1. Find existing
    const hasPermit = await repo.findOne({ where: { id } });

    if (!hasPermit) {
      return res.status(404).json({ message: 'Has Permit not found' });
    }

    // 2. Merge request body to entity
    repo.merge(hasPermit, req.body);

    // 3. Save the updated entity
    const updated = await repo.save(hasPermit);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.hasPermitDelete = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(HasPermit);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ message: 'Has Permit not found' });
    }

    res.json({ message: 'Has Permit deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};