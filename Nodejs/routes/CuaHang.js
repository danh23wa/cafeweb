const express = require('express');
const sql = require('mssql');
const router = express.Router();

module.exports = (pool, translateText) => {
  // API lấy tất cả cửa hàng
  router.get('/', async (req, res) => {
    const lang = req.query.lang || "vi";
    try {
      const result = await pool
        .request()
        .query(`
          SELECT StoreID, StoreName, Address, Latitude, Longitude, ImageURL 
          FROM Stores
        `);
      const stores = await Promise.all(
        result.recordset.map(async (store) => ({
          StoreID: store.StoreID,
          StoreName: await translateText(store.StoreName, lang),
          Address: await translateText(store.Address, lang),
          Latitude: store.Latitude,
          Longitude: store.Longitude,
          ImageURL: store.ImageURL,
        }))
      );
      res.json(stores);
    } catch (error) {
      console.error('Lỗi truy vấn SQL:', error);
      res.status(500).json({ error: 'Lỗi máy chủ' });
    }
  });

  // API tìm kiếm cửa hàng theo địa chỉ
  router.get('/search', async (req, res) => {
    const lang = req.query.lang || "vi";
    try {
      let { address } = req.query;
      if (!address) {
        return res.status(400).json({ error: 'Vui lòng cung cấp địa chỉ' });
      }

      const result = await pool
        .request()
        .input('address', sql.NVarChar, `%${address}%`)
        .query(`
          SELECT StoreID, StoreName, Address, Latitude, Longitude, ImageURL 
          FROM Stores 
          WHERE Address LIKE @address
        `);
      const stores = await Promise.all(
        result.recordset.map(async (store) => ({
          StoreID: store.StoreID,
          StoreName: await translateText(store.StoreName, lang),
          Address: await translateText(store.Address, lang),
          Latitude: store.Latitude,
          Longitude: store.Longitude,
          ImageURL: store.ImageURL,
        }))
      );
      res.json(stores);
    } catch (error) {
      console.error('Lỗi truy vấn SQL:', error);
      res.status(500).json({ error: 'Lỗi máy chủ' });
    }
  });

  // API thêm cửa hàng mới
  router.post('/', async (req, res) => {
    try {
      const { storeName, address, latitude, longitude, imageUrl } = req.body;
      if (!storeName || !address || latitude == null || longitude == null) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin' });
      }

      const result = await pool
        .request()
        .input('storeName', sql.NVarChar, storeName)
        .input('address', sql.NVarChar, address)
        .input('latitude', sql.Float, latitude)
        .input('longitude', sql.Float, longitude)
        .input('imageUrl', sql.NVarChar, imageUrl || null)
        .query(`
          INSERT INTO Stores (StoreName, Address, Latitude, Longitude, ImageURL) 
          OUTPUT INSERTED.* 
          VALUES (@storeName, @address, @latitude, @longitude, @imageUrl)
        `);

      res.status(201).json(result.recordset[0]);
    } catch (error) {
      console.error('Lỗi khi thêm cửa hàng:', error);
      res.status(500).json({ error: 'Lỗi máy chủ' });
    }
  });

  // API cập nhật cửa hàng
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { storeName, address, latitude, longitude, imageUrl } = req.body;
      if (!storeName || !address || latitude == null || longitude == null) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin' });
      }

      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .input('storeName', sql.NVarChar, storeName)
        .input('address', sql.NVarChar, address)
        .input('latitude', sql.Float, latitude)
        .input('longitude', sql.Float, longitude)
        .input('imageUrl', sql.NVarChar, imageUrl || null)
        .query(`
          UPDATE Stores 
          SET StoreName = @storeName, Address = @address, Latitude = @latitude, Longitude = @longitude, ImageURL = @imageUrl 
          OUTPUT INSERTED.* 
          WHERE StoreID = @id
        `);

      if (result.recordset.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy cửa hàng' });
      }

      res.json(result.recordset[0]);
    } catch (error) {
      console.error('Lỗi khi cập nhật cửa hàng:', error);
      res.status(500).json({ error: 'Lỗi máy chủ' });
    }
  });

  // API xóa cửa hàng
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.request().input('id', sql.Int, id).query('DELETE FROM Stores WHERE StoreID = @id');
      res.json({ message: 'Xóa cửa hàng thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa cửa hàng:', error);
      res.status(500).json({ error: 'Lỗi máy chủ' });
    }
  });

  return router;
};