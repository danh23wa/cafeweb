const express = require('express');
const router = express.Router();
const sql = require('mssql');

module.exports = (pool, translateText) => {
  // Lấy tất cả loại sản phẩm
  router.get('/', async (req, res) => {
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request().query('SELECT * FROM dbo.LoaiSanPham');
      const categories = await Promise.all(
        result.recordset.map(async (item) => ({
          MaLoaiSanPham: item.MaLoaiSanPham,
          TenLoaiSanPham: await translateText(item.TenLoaiSanPham, lang),
          MoTa: await translateText(item.MoTa, lang),
        }))
      );
      res.json(categories);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Lấy loại sản phẩm theo MaLoaiSanPham
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request()
        .input('MaLoaiSanPham', sql.Int, id)
        .query('SELECT * FROM dbo.LoaiSanPham WHERE MaLoaiSanPham = @MaLoaiSanPham');
      if (result.recordset.length > 0) {
        const item = result.recordset[0];
        res.json({
          MaLoaiSanPham: item.MaLoaiSanPham,
          TenLoaiSanPham: await translateText(item.TenLoaiSanPham, lang),
          MoTa: await translateText(item.MoTa, lang),
        });
      } else {
        res.status(404).send('Không tìm thấy loại sản phẩm');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Thêm loại sản phẩm mới
  router.post('/', async (req, res) => {
    const { TenLoaiSanPham, MoTa } = req.body;
    try {
      const result = await pool.request()
        .input('TenLoaiSanPham', sql.VarChar, TenLoaiSanPham)
        .input('MoTa', sql.VarChar, MoTa)
        .query(`
          INSERT INTO dbo.LoaiSanPham (TenLoaiSanPham, MoTa)
          VALUES (@TenLoaiSanPham, @MoTa);
          SELECT SCOPE_IDENTITY() AS MaLoaiSanPham;
        `);
      res.status(201).json({ MaLoaiSanPham: result.recordset[0].MaLoaiSanPham });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Sửa (cập nhật) loại sản phẩm
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { TenLoaiSanPham, MoTa } = req.body;
    try {
      const result = await pool.request()
        .input('MaLoaiSanPham', sql.Int, id)
        .input('TenLoaiSanPham', sql.VarChar, TenLoaiSanPham)
        .input('MoTa', sql.VarChar, MoTa)
        .query(`
          UPDATE dbo.LoaiSanPham
          SET TenLoaiSanPham = @TenLoaiSanPham, MoTa = @MoTa
          WHERE MaLoaiSanPham = @MaLoaiSanPham
        `);
      if (result.rowsAffected[0] > 0) {
        res.send('Cập nhật loại sản phẩm thành công');
      } else {
        res.status(404).send('Không tìm thấy loại sản phẩm');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // Xóa loại sản phẩm
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.request()
        .input('MaLoaiSanPham', sql.Int, id)
        .query('DELETE FROM dbo.LoaiSanPham WHERE MaLoaiSanPham = @MaLoaiSanPham');
      if (result.rowsAffected[0] > 0) {
        res.send('Xóa loại sản phẩm thành công');
      } else {
        res.status(404).send('Không tìm thấy loại sản phẩm');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  return router;
};