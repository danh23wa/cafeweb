const express = require('express');
const router = express.Router();
const sql = require('mssql');

module.exports = (pool, translateText) => {
  // Lấy giỏ hàng của khách hàng với thông tin sản phẩm
  router.get('/:makhachhang', async (req, res) => {
    const { makhachhang } = req.params;
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request()
        .input('MaKhachHang', sql.Int, makhachhang)
        .query(`
          SELECT 
            gh.MaKhachHang, 
            gh.MaSanPham, 
            gh.SoLuong, 
            sp.TenSanPham, 
            sp.Gia, 
            sp.HinhAnh
          FROM dbo.GioHang gh
          INNER JOIN dbo.SanPham sp ON gh.MaSanPham = sp.MaSanPham
          WHERE gh.MaKhachHang = @MaKhachHang
        `);
      const cart = await Promise.all(
        result.recordset.map(async (item) => ({
          MaKhachHang: item.MaKhachHang,
          MaSanPham: item.MaSanPham,
          SoLuong: item.SoLuong,
          TenSanPham: await translateText(item.TenSanPham, lang),
          Gia: item.Gia,
          HinhAnh: item.HinhAnh,
        }))
      );
      res.json(cart);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Thêm hoặc cập nhật sản phẩm trong giỏ hàng
  router.post('/', async (req, res) => {
    const { MaKhachHang, MaSanPham, SoLuong } = req.body;
    try {
      const result = await pool.request()
        .input('MaKhachHang', sql.Int, MaKhachHang)
        .input('MaSanPham', sql.Int, MaSanPham)
        .input('SoLuong', sql.Int, SoLuong)
        .query(`
          IF EXISTS (SELECT 1 FROM dbo.GioHang WHERE MaKhachHang = @MaKhachHang AND MaSanPham = @MaSanPham)
            UPDATE dbo.GioHang
            SET SoLuong = SoLuong + @SoLuong
            WHERE MaKhachHang = @MaKhachHang AND MaSanPham = @MaSanPham
          ELSE
            INSERT INTO dbo.GioHang (MaKhachHang, MaSanPham, SoLuong)
            VALUES (@MaKhachHang, @MaSanPham, @SoLuong)
        `);
      res.status(201).send('Thêm hoặc cập nhật giỏ hàng thành công');
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Xóa sản phẩm khỏi giỏ hàng
  router.delete('/:makhachhang/:masanpham', async (req, res) => {
    const { makhachhang, masanpham } = req.params;
    try {
      const result = await pool.request()
        .input('MaKhachHang', sql.Int, makhachhang)
        .input('MaSanPham', sql.Int, masanpham)
        .query(`
          DELETE FROM dbo.GioHang 
          WHERE MaKhachHang = @MaKhachHang AND MaSanPham = @MaSanPham
        `);
      if (result.rowsAffected[0] > 0) {
        res.send('Xóa sản phẩm khỏi giỏ hàng thành công');
      } else {
        res.status(404).send('Không tìm thấy sản phẩm trong giỏ hàng');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  return router;
};