const jwt = require('jsonwebtoken');

const userController = require('../controllers/userController');
const sessionData = [];

module.exports = (permissions = []) => {
  return async(req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token not found" });
      }

      const token = authHeader.split(" ")[1];
      let sessionFilter = sessionData.find(item => item.id === token);
      if (!sessionFilter) {
        await userController.sessionDeleteExpired()
        console.log('Mencari session di database');
        const searchSession = await userController.sessionById(token);
        if(searchSession){
          sessionData.push(searchSession)
          sessionFilter = searchSession
        } else {
          // Melemparkan error untuk menghentikan proses dan langsung menuju catch(err)
          const error = new Error("The session is invalid or has expired.");
          error.status = 401; // Tambahkan properti status agar bisa ditangani di error handler
          throw error;
        }
      }

      const decoded = jwt.verify(
        sessionFilter.payload,
        process.env.JWT_SECRET || "secretKey123"
      );

      // Simpan data user dan izin ke objek request
      req.user = decoded; 

      // --- OTORISASI BERDASARKAN PERMISSION ---

      // 1. Ambil list izin dari payload JWT (misal: ["POS", "DASHBOARD"])
      const userPermissions = decoded.hasPermit || []; 

      // 2. Periksa apakah endpoint ini memerlukan izin tertentu (permissions.length > 0)
      if (permissions.length > 0) {
        
        // 3. Cek apakah user memiliki SETIDAKNYA SATU izin yang diperlukan
        const hasRequiredPermission = permissions.some(requiredPermit => 
          userPermissions.includes(requiredPermit)
        );

        if (!hasRequiredPermission) {
          // Jika tidak memiliki izin yang diperlukan
          return res.status(403).json({ 
            message: "Do not have permission for this operation.",
            login: true 
          });
        }
      }

      // Lanjut ke handler berikutnya jika autentikasi dan otorisasi berhasil
      next();

    } catch (err) {
      //Tangani error yang dilempar, atau teruskan ke error handler global
      if (err.status) {
        return res.status(err.status).json({ message: err.message, login: false });
      }
      // Menangani error token (misalnya: token tidak valid, format salah, atau expired)
      return res.status(401).json({ 
        message: "Token invalid atau expired",
        login: false
      });
    }
  };
};