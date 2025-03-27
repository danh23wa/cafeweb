const express = require("express");
const sql = require("mssql");
const router = express.Router();

module.exports = (pool, translateText) => {
  // Lấy danh sách tin tức
  router.get("/", async (req, res) => {
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request().query("SELECT * FROM TinTuc");
      const news = await Promise.all(
        result.recordset.map(async (item) => ({
          id: item.id,
          tieu_de: await translateText(item.tieu_de, lang),
          hinh_anh: item.hinh_anh,
          ngay_tao: item.ngay_tao,
        }))
      );
      res.json(news);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Thêm tin tức mới
  router.post("/", async (req, res) => {
    const { tieu_de, hinh_anh } = req.body;
    try {
      const result = await pool
        .request()
        .input("tieu_de", sql.NVarChar, tieu_de)
        .input("hinh_anh", sql.NVarChar, hinh_anh)
        .query(`
          INSERT INTO TinTuc (tieu_de, hinh_anh) 
          OUTPUT INSERTED.* 
          VALUES (@tieu_de, @hinh_anh)
        `);
      res.status(201).json(result.recordset[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Cập nhật tin tức
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { tieu_de, hinh_anh } = req.body;
    try {
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input("tieu_de", sql.NVarChar, tieu_de)
        .input("hinh_anh", sql.NVarChar, hinh_anh)
        .query(`
          UPDATE TinTuc 
          SET tieu_de = @tieu_de, hinh_anh = @hinh_anh 
          OUTPUT INSERTED.* 
          WHERE id = @id
        `);
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy tin tức" });
      }
      res.json(result.recordset[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Xóa tin tức
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await pool.request().input("id", sql.Int, id).query("DELETE FROM TinTuc WHERE id = @id");
      res.json({ message: "Xóa tin tức thành công" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};