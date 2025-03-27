const express = require('express');
const router = express.Router();
const sql = require('mssql');

module.exports = (pool, translateText) => {
  // Lấy tất cả đơn hàng
  router.get('/', async (req, res) => {
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request().query('SELECT * FROM dbo.DonHang');
      const orders = await Promise.all(
        result.recordset.map(async (item) => ({
          MaDonHang: item.MaDonHang,
          MaKhachHang: item.MaKhachHang,
          TongTien: item.TongTien,
          DiaChi: await translateText(item.DiaChi, lang),
          TrangThai: await translateText(item.TrangThai, lang),
          NgayDatHang: item.NgayDatHang,
        }))
      );
      res.json(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).send('Lỗi server khi lấy danh sách đơn hàng');
    }
  });

  // Lấy đơn hàng theo MaKhachHang
  router.get('/:makhachhang', async (req, res) => {
    const { makhachhang } = req.params;
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request()
        .input('MaKhachHang', sql.Int, makhachhang)
        .query('SELECT * FROM dbo.DonHang WHERE MaKhachHang = @MaKhachHang');
      const orders = await Promise.all(
        result.recordset.map(async (item) => ({
          MaDonHang: item.MaDonHang,
          MaKhachHang: item.MaKhachHang,
          TongTien: item.TongTien,
          DiaChi: await translateText(item.DiaChi, lang),
          TrangThai: await translateText(item.TrangThai, lang),
          NgayDatHang: item.NgayDatHang,
        }))
      );
      res.json(orders);
    } catch (err) {
      console.error("Error fetching orders by customer:", err);
      res.status(500).send('Lỗi server khi lấy đơn hàng của khách hàng');
    }
  });

  // Thêm đơn hàng mới
  router.post('/', async (req, res) => {
    const { MaKhachHang, TongTien, DiaChi, TrangThai } = req.body;
    if (!MaKhachHang || !TongTien || !DiaChi) {
      return res.status(400).send('MaKhachHang, TongTien và DiaChi là bắt buộc');
    }
    try {
      const result = await pool.request()
        .input('MaKhachHang', sql.Int, MaKhachHang)
        .input('TongTien', sql.Decimal(10, 2), TongTien)
        .input('DiaChi', sql.NVarChar, DiaChi)
        .input('TrangThai', sql.NVarChar, TrangThai || 'Chưa thanh toán')
        .query(`
          INSERT INTO dbo.DonHang (MaKhachHang, TongTien, DiaChi, TrangThai)
          VALUES (@MaKhachHang, @TongTien, @DiaChi, @TrangThai);
          SELECT SCOPE_IDENTITY() AS MaDonHang;
        `);
      res.status(201).json({ MaDonHang: result.recordset[0].MaDonHang });
    } catch (err) {
      console.error("Error inserting order:", err);
      res.status(500).send('Lỗi server khi thêm đơn hàng');
    }
  });

  // Cập nhật trạng thái đơn hàng (đã xóa phần cập nhật trạng thái thanh toán)
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { TrangThai } = req.body;
    if (!TrangThai) {
      return res.status(400).send('Trạng thái là bắt buộc');
    }
    try {
      const result = await pool.request()
        .input('MaDonHang', sql.Int, id)
        .input('TrangThai', sql.NVarChar, TrangThai)
        .query(`
          UPDATE dbo.DonHang
          SET TrangThai = @TrangThai
          WHERE MaDonHang = @MaDonHang
        `);
      if (result.rowsAffected[0] === 0) {
        return res.status(404).send('Không tìm thấy đơn hàng');
      }
      res.send('Cập nhật trạng thái đơn hàng thành công');
    } catch (err) {
      console.error("Error updating order status:", err);
      res.status(500).send('Lỗi server khi cập nhật trạng thái');
    }
  });

  return router;
};