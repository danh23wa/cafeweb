const express = require('express');
const router = express.Router();
const sql = require('mssql');

module.exports = (pool, translateText) => {
  // Lấy tất cả sản phẩm
  router.get('/', async (req, res) => {
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request().query('SELECT * FROM dbo.SanPham');
      const products = await Promise.all(
        result.recordset.map(async (item) => ({
          MaSanPham: item.MaSanPham,
          TenSanPham: await translateText(item.TenSanPham, lang),
          Gia: item.Gia,
          MaLoaiSanPham: item.MaLoaiSanPham,
          MoTa: await translateText(item.MoTa, lang),
          HinhAnh: item.HinhAnh,
        }))
      );
      res.json(products);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Thêm sản phẩm
  router.post('/', async (req, res) => {
    try {
      const { TenSanPham, Gia, MaLoaiSanPham, MoTa, HinhAnh } = req.body;
      const result = await pool.request()
        .input('TenSanPham', sql.NVarChar, TenSanPham)
        .input('Gia', sql.Int, Gia)
        .input('MaLoaiSanPham', sql.Int, MaLoaiSanPham)
        .input('MoTa', sql.NVarChar, MoTa)
        .input('HinhAnh', sql.NVarChar, HinhAnh)
        .query(`
          INSERT INTO dbo.SanPham (TenSanPham, Gia, MaLoaiSanPham, MoTa, HinhAnh) 
          OUTPUT INSERTED.* 
          VALUES (@TenSanPham, @Gia, @MaLoaiSanPham, @MoTa, @HinhAnh)
        `);
      res.json(result.recordset[0]);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Cập nhật sản phẩm
  router.put('/:id', async (req, res) => {
    try {
      const { TenSanPham, Gia, MaLoaiSanPham, MoTa, HinhAnh } = req.body;
      await pool.request()
        .input('id', sql.Int, req.params.id)
        .input('TenSanPham', sql.NVarChar, TenSanPham)
        .input('Gia', sql.Int, Gia)
        .input('MaLoaiSanPham', sql.Int, MaLoaiSanPham)
        .input('MoTa', sql.NVarChar, MoTa)
        .input('HinhAnh', sql.NVarChar, HinhAnh)
        .query(`
          UPDATE dbo.SanPham 
          SET TenSanPham = @TenSanPham, Gia = @Gia, MaLoaiSanPham = @MaLoaiSanPham, MoTa = @MoTa, HinhAnh = @HinhAnh 
          WHERE MaSanPham = @id
        `);
      res.send('Sửa thành công');
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Xóa sản phẩm
  router.delete('/:id', async (req, res) => {
    try {
      await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('DELETE FROM dbo.SanPham WHERE MaSanPham = @id');
      res.send('Xóa thành công');
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Lấy sản phẩm theo mã loại sản phẩm
  router.get('/category/:maLoaiSanPham', async (req, res) => {
    const lang = req.query.lang || "vi";
    try {
      const { maLoaiSanPham } = req.params;
      const result = await pool.request()
        .input('MaLoaiSanPham', sql.Int, maLoaiSanPham)
        .query('SELECT * FROM dbo.SanPham WHERE MaLoaiSanPham = @MaLoaiSanPham');
      if (result.recordset.length > 0) {
        const products = await Promise.all(
          result.recordset.map(async (item) => ({
            MaSanPham: item.MaSanPham,
            TenSanPham: await translateText(item.TenSanPham, lang),
            Gia: item.Gia,
            MaLoaiSanPham: item.MaLoaiSanPham,
            MoTa: await translateText(item.MoTa, lang),
            HinhAnh: item.HinhAnh,
          }))
        );
        res.json(products);
      } else {
        res.status(404).send('Không tìm thấy sản phẩm nào thuộc loại này');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  return router;
};