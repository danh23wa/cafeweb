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
        .input('DiaChi', sql.VarChar, DiaChi)
        .input('TrangThai', sql.VarChar, TrangThai || 'Chưa thanh toán')
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

  // Cập nhật trạng thái đơn hàng
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { TrangThai } = req.body;
    if (!TrangThai) {
      return res.status(400).send('Trạng thái là bắt buộc');
    }
    try {
      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      // Cập nhật trạng thái đơn hàng
      const updateOrder = await transaction.request()
        .input('MaDonHang', sql.Int, id)
        .input('TrangThai', sql.VarChar, TrangThai)
        .query(`
          UPDATE dbo.DonHang
          SET TrangThai = @TrangThai
          WHERE MaDonHang = @MaDonHang
        `);
      if (updateOrder.rowsAffected[0] === 0) {
        await transaction.rollback();
        return res.status(404).send('Không tìm thấy đơn hàng');
      }

      // Xác định trạng thái thanh toán phù hợp
      const paymentStatus = TrangThai === "thanh toán thành công" ? "thanh toán thành công" : "chưa thanh toán";

      // Cập nhật trạng thái thanh toán tương ứng với đơn hàng
      const updatePayment = await transaction.request()
        .input('MaDonHang', sql.Int, id)
        .input('TrangThai', sql.VarChar, paymentStatus)
        .query(`
          UPDATE dbo.ThanhToan
          SET TrangThai = @TrangThai
          WHERE MaDonHang = @MaDonHang
        `);

      await transaction.commit();
      res.send('Cập nhật trạng thái đơn hàng và thanh toán thành công');
    } catch (err) {
      console.error("Error updating order and payment status:", err);
      res.status(500).send('Lỗi server khi cập nhật trạng thái');
    }
  });

  return router;
};