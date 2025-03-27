const express = require('express');
const router = express.Router();
const sql = require('mssql');

module.exports = (pool, translateText) => {
  // Lấy tất cả chi tiết đơn hàng
  router.get('/', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT * FROM dbo.ChiTietHoaDon');
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Lấy chi tiết đơn hàng theo MaDonHang
  router.get('/donhang/:madonhang', async (req, res) => {
    const { madonhang } = req.params;
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request()
        .input('MaDonHang', sql.Int, madonhang)
        .query(`
          SELECT 
            cthd.MaChiTietHoaDon,
            cthd.MaDonHang,
            cthd.MaSanPham,
            cthd.SoLuong,
            cthd.DonGia,
            cthd.ThanhTien,
            sp.TenSanPham,
            sp.HinhAnh
          FROM dbo.ChiTietHoaDon cthd
          INNER JOIN dbo.SanPham sp ON cthd.MaSanPham = sp.MaSanPham
          WHERE cthd.MaDonHang = @MaDonHang
        `);
      if (result.recordset.length > 0) {
        const translatedDetails = await Promise.all(
          result.recordset.map(async (item) => ({
            ...item,
            TenSanPham: await translateText(item.TenSanPham, lang),
          }))
        );
        res.json(translatedDetails);
      } else {
        res.status(404).send('Không tìm thấy chi tiết đơn hàng nào');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Thêm chi tiết đơn hàng mới
  router.post('/', async (req, res) => {
    const { MaDonHang, MaSanPham, SoLuong, DonGia } = req.body;
    try {
      const result = await pool.request()
        .input('MaDonHang', sql.Int, MaDonHang)
        .input('MaSanPham', sql.Int, MaSanPham)
        .input('SoLuong', sql.Int, SoLuong)
        .input('DonGia', sql.Decimal(10, 2), DonGia)
        .query(`
          INSERT INTO dbo.ChiTietHoaDon (MaDonHang, MaSanPham, SoLuong, DonGia)
          VALUES (@MaDonHang, @MaSanPham, @SoLuong, @DonGia);
          SELECT SCOPE_IDENTITY() AS MaChiTietHoaDon;
        `);
      res.status(201).json({ MaChiTietHoaDon: result.recordset[0].MaChiTietHoaDon });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Cập nhật chi tiết đơn hàng
  router.put('/:machitiethoadon', async (req, res) => {
    const { machitiethoadon } = req.params;
    const { SoLuong, DonGia } = req.body;
    try {
      const result = await pool.request()
        .input('MaChiTietHoaDon', sql.Int, machitiethoadon)
        .input('SoLuong', sql.Int, SoLuong)
        .input('DonGia', sql.Decimal(10, 2), DonGia)
        .query(`
          UPDATE dbo.ChiTietHoaDon
          SET SoLuong = @SoLuong, DonGia = @DonGia
          WHERE MaChiTietHoaDon = @MaChiTietHoaDon
        `);
      if (result.rowsAffected[0] > 0) {
        res.send('Cập nhật chi tiết đơn hàng thành công');
      } else {
        res.status(404).send('Không tìm thấy chi tiết đơn hàng để cập nhật');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Xóa chi tiết đơn hàng
  router.delete('/:machitiethoadon', async (req, res) => {
    const { machitiethoadon } = req.params;
    try {
      const result = await pool.request()
        .input('MaChiTietHoaDon', sql.Int, machitiethoadon)
        .query(`
          DELETE FROM dbo.ChiTietHoaDon
          WHERE MaChiTietHoaDon = @MaChiTietHoaDon
        `);
      if (result.rowsAffected[0] > 0) {
        res.send('Xóa chi tiết đơn hàng thành công');
      } else {
        res.status(404).send('Không#pragma once tìm thấy chi tiết đơn hàng để xóa');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  return router;
};