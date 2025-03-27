const express = require('express');
const router = express.Router();
const sql = require('mssql');

module.exports = (pool, translateText) => {
  // Lấy tất cả thanh toán
  router.get('/', async (req, res) => {
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request().query('SELECT * FROM dbo.ThanhToan');
      const payments = await Promise.all(
        result.recordset.map(async (item) => ({
          MaThanhToan: item.MaThanhToan,
          MaDonHang: item.MaDonHang,
          MaPhuongThuc: item.MaPhuongThuc,
          SoTien: item.SoTien,
          TrangThai: await translateText(item.TrangThai, lang),
          NgayThanhToan: item.NgayThanhToan,
        }))
      );
      res.json(payments);
    } catch (err) {
      console.error("Error fetching payments:", err);
      res.status(500).send(err.message);
    }
  });

  // Thêm thanh toán mới
  router.post('/', async (req, res) => {
    const { MaDonHang, MaPhuongThuc, SoTien, TrangThai } = req.body;
    console.log("Received payment data:", { MaDonHang, MaPhuongThuc, SoTien, TrangThai });
    try {
      const result = await pool.request()
        .input('MaDonHang', sql.Int, MaDonHang)
        .input('MaPhuongThuc', sql.Int, MaPhuongThuc)
        .input('SoTien', sql.Decimal(10, 2), SoTien)
        .input('TrangThai', sql.VarChar, TrangThai)
        .query(`
          INSERT INTO dbo.ThanhToan (MaDonHang, MaPhuongThuc, SoTien, TrangThai)
          VALUES (@MaDonHang, @MaPhuongThuc, @SoTien, @TrangThai);
          SELECT SCOPE_IDENTITY() AS MaThanhToan;
        `);
      console.log("Payment inserted:", result.recordset[0]);
      res.status(201).json({ MaThanhToan: result.recordset[0].MaThanhToan });
    } catch (err) {
      console.error("Error inserting payment:", err);
      res.status(500).send(err.message);
    }
  });

  // Cập nhật trạng thái thanh toán theo mã đơn hàng
  router.put('/:maDonHang', async (req, res) => {
    const { maDonHang } = req.params;
    const { TrangThai } = req.body;
    console.log("Updating payment status:", { maDonHang, TrangThai });
    try {
      const result = await pool.request()
        .input('MaDonHang', sql.Int, maDonHang)
        .input('TrangThai', sql.VarChar, TrangThai)
        .query(`
          UPDATE dbo.ThanhToan
          SET TrangThai = @TrangThai
          WHERE MaDonHang = @MaDonHang;
        `);
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Payment not found" });
      }
      console.log("Payment status updated:", { maDonHang, TrangThai });
      res.status(200).json({ message: "Payment status updated successfully" });
    } catch (err) {
      console.error("Error updating payment status:", err);
      res.status(500).send(err.message);
    }
  });

  return router;
};