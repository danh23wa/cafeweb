const express = require("express");
const sql = require("mssql");

module.exports = (pool, translateText) => {
  const router = express.Router();

  // Lấy chi tiết tin tức theo tin_tuc_id
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const lang = req.query.lang || "vi";
    try {
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM ChiTietTinTuc WHERE tin_tuc_id = @id");
      const details = await Promise.all(
        result.recordset.map(async (item) => ({
          id: item.id,
          tin_tuc_id: item.tin_tuc_id,
          noi_dung: await translateText(item.noi_dung, lang),
          danh_sach_san_pham: await translateText(item.danh_sach_san_pham, lang),
          ma_khuyen_mai: await translateText(item.ma_khuyen_mai, lang),
          thoi_gian_ap_dung: await translateText(item.thoi_gian_ap_dung, lang),
          lien_ket: await translateText(item.lien_ket, lang),
          hinh_anh: item.hinh_anh,
        }))
      );
      res.json(details);
    } catch (err) {
      console.error("Lỗi truy vấn:", err);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  });

  // Thêm chi tiết tin tức
  router.post("/", async (req, res) => {
    const { tin_tuc_id, noi_dung, danh_sach_san_pham, ma_khuyen_mai, thoi_gian_ap_dung, lien_ket, hinh_anh } = req.body;
    if (!tin_tuc_id || !noi_dung) {
      return res.status(400).json({ error: "tin_tuc_id và noi_dung là bắt buộc" });
    }
    try {
      const result = await pool
        .request()
        .input("tin_tuc_id", sql.Int, tin_tuc_id)
        .input("noi_dung", sql.NVarChar(sql.MAX), noi_dung)
        .input("danh_sach_san_pham", sql.NVarChar(sql.MAX), danh_sach_san_pham || null)
        .input("ma_khuyen_mai", sql.NVarChar(50), ma_khuyen_mai || null)
        .input("thoi_gian_ap_dung", sql.NVarChar(255), thoi_gian_ap_dung || null)
        .input("lien_ket", sql.NVarChar(500), lien_ket || null)
        .input("hinh_anh", sql.NVarChar(500), hinh_anh || null)
        .query(`
          INSERT INTO ChiTietTinTuc (tin_tuc_id, noi_dung, danh_sach_san_pham, ma_khuyen_mai, thoi_gian_ap_dung, lien_ket, hinh_anh) 
          OUTPUT INSERTED.* 
          VALUES (@tin_tuc_id, @noi_dung, @danh_sach_san_pham, @ma_khuyen_mai, @thoi_gian_ap_dung, @lien_ket, @hinh_anh)
        `);
      res.status(201).json(result.recordset[0]);
    } catch (err) {
      console.error("Lỗi thêm dữ liệu:", err);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  });

  // Cập nhật chi tiết tin tức
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { tin_tuc_id, noi_dung, danh_sach_san_pham, ma_khuyen_mai, thoi_gian_ap_dung, lien_ket, hinh_anh } = req.body;
    if (!tin_tuc_id || !noi_dung) {
      return res.status(400).json({ error: "tin_tuc_id và noi_dung là bắt buộc" });
    }
    try {
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .input("tin_tuc_id", sql.Int, tin_tuc_id)
        .input("noi_dung", sql.NVarChar(sql.MAX), noi_dung)
        .input("danh_sach_san_pham", sql.NVarChar(sql.MAX), danh_sach_san_pham || null)
        .input("ma_khuyen_mai", sql.NVarChar(50), ma_khuyen_mai || null)
        .input("thoi_gian_ap_dung", sql.NVarChar(255), thoi_gian_ap_dung || null)
        .input("lien_ket", sql.NVarChar(500), lien_ket || null)
        .input("hinh_anh", sql.NVarChar(500), hinh_anh || null)
        .query(`
          UPDATE ChiTietTinTuc 
          SET tin_tuc_id = @tin_tuc_id, noi_dung = @noi_dung, danh_sach_san_pham = @danh_sach_san_pham, 
              ma_khuyen_mai = @ma_khuyen_mai, thoi_gian_ap_dung = @thoi_gian_ap_dung, lien_ket = @lien_ket, hinh_anh = @hinh_anh 
          OUTPUT INSERTED.* 
          WHERE id = @id
        `);
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy chi tiết tin tức" });
      }
      res.json(result.recordset[0]);
    } catch (err) {
      console.error("Lỗi cập nhật dữ liệu:", err);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  });

  // Xóa chi tiết tin tức
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query("DELETE FROM ChiTietTinTuc WHERE id = @id");
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Không tìm thấy chi tiết tin tức" });
      }
      res.json({ message: "Xóa chi tiết tin tức thành công" });
    } catch (err) {
      console.error("Lỗi xóa dữ liệu:", err);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  });

  return router;
};