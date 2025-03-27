const express = require('express');
const router = express.Router();
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'nguyendanh9991@gmail.com',
    pass: 'zkviarxbkzzmoums',
  },
});

const resetCodes = {};

module.exports = (pool, translateText) => {
  // Lấy tất cả người dùng
  router.get('/', async (req, res) => {
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request().query('SELECT MaNguoiDung, TenNguoiDung, Email, SoDienThoai, VaiTro FROM dbo.NguoiDung');
      const users = await Promise.all(
        result.recordset.map(async (item) => ({
          MaNguoiDung: item.MaNguoiDung,
          TenNguoiDung: await translateText(item.TenNguoiDung, lang),
          Email: item.Email,
          SoDienThoai: item.SoDienThoai,
          VaiTro: await translateText(item.VaiTro, lang),
        }))
      );
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).send('Lỗi server khi lấy danh sách người dùng');
    }
  });

  // Đổi mật khẩu
  router.put('/:id/password', async (req, res) => {
    const { id } = req.params;
    const { MatKhauCu, MatKhauMoi } = req.body;
    if (!MatKhauCu || !MatKhauMoi) {
      return res.status(400).send('Mật khẩu cũ và mật khẩu mới là bắt buộc');
    }
    try {
      const result = await pool.request()
        .input('MaNguoiDung', sql.Int, id)
        .query('SELECT MatKhau FROM dbo.NguoiDung WHERE MaNguoiDung = @MaNguoiDung');
      if (result.recordset.length === 0) {
        return res.status(404).send('Không tìm thấy người dùng');
      }
      const user = result.recordset[0];
      const isMatch = await bcrypt.compare(MatKhauCu, user.MatKhau);
      if (!isMatch) {
        return res.status(401).send('Mật khẩu cũ không đúng');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(MatKhauMoi, salt);
      await pool.request()
        .input('MaNguoiDung', sql.Int, id)
        .input('MatKhauMoi', sql.VarChar, hashedPassword)
        .query('UPDATE dbo.NguoiDung SET MatKhau = @MatKhauMoi WHERE MaNguoiDung = @MaNguoiDung');
      res.send('Đổi mật khẩu thành công');
    } catch (err) {
      console.error('Lỗi khi đổi mật khẩu:', err);
      res.status(500).send('Lỗi server khi đổi mật khẩu');
    }
  });

  // Lấy người dùng theo MaNguoiDung
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const lang = req.query.lang || "vi";
    try {
      const result = await pool.request()
        .input('MaNguoiDung', sql.Int, id)
        .query('SELECT MaNguoiDung, TenNguoiDung, Email, SoDienThoai, VaiTro FROM dbo.NguoiDung WHERE MaNguoiDung = @MaNguoiDung');
      if (result.recordset.length > 0) {
        const item = result.recordset[0];
        res.json({
          MaNguoiDung: item.MaNguoiDung,
          TenNguoiDung: await translateText(item.TenNguoiDung, lang),
          Email: item.Email,
          SoDienThoai: item.SoDienThoai,
          VaiTro: await translateText(item.VaiTro, lang),
        });
      } else {
        res.status(404).send('Không tìm thấy người dùng');
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).send('Lỗi server khi lấy thông tin người dùng');
    }
  });

  // Đăng ký
  router.post('/register', async (req, res) => {
    const { TenNguoiDung, SoDienThoai, Email, MatKhau, VaiTro } = req.body;
    if (!TenNguoiDung || !Email || !MatKhau) {
      return res.status(400).send('Tên người dùng, email và mật khẩu là bắt buộc');
    }
    try {
      const checkEmail = await pool.request()
        .input('Email', sql.VarChar, Email)
        .query('SELECT * FROM dbo.NguoiDung WHERE Email = @Email');
      if (checkEmail.recordset.length > 0) {
        return res.status(400).send('Email đã được sử dụng');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(MatKhau, salt);
      const vaiTro = VaiTro || 'KhachHang';
      const result = await pool.request()
        .input('TenNguoiDung', sql.VarChar, TenNguoiDung)
        .input('SoDienThoai', sql.VarChar, SoDienThoai)
        .input('Email', sql.VarChar, Email)
        .input('MatKhau', sql.VarChar, hashedPassword)
        .input('VaiTro', sql.VarChar, vaiTro)
        .query(`
          INSERT INTO dbo.NguoiDung (TenNguoiDung, SoDienThoai, Email, MatKhau, VaiTro)
          VALUES (@TenNguoiDung, @SoDienThoai, @Email, @MatKhau, @VaiTro);
          SELECT SCOPE_IDENTITY() AS MaNguoiDung;
        `);
      res.status(201).json({ MaNguoiDung: result.recordset[0].MaNguoiDung });
    } catch (err) {
      console.error("Error registering user:", err);
      res.status(500).send('Lỗi server khi đăng ký người dùng');
    }
  });

  // Đăng nhập
  router.post('/login', async (req, res) => {
    const { Email, MatKhau } = req.body;
    if (!Email || !MatKhau) {
      return res.status(400).send('Email và mật khẩu là bắt buộc');
    }
    try {
      const result = await pool.request()
        .input('Email', sql.VarChar, Email)
        .query('SELECT * FROM dbo.NguoiDung WHERE Email = @Email');
      if (result.recordset.length === 0) {
        return res.status(401).send('Email hoặc mật khẩu không đúng');
      }
      const user = result.recordset[0];
      const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
      if (!isMatch) {
        return res.status(401).send('Email hoặc mật khẩu không đúng');
      }
      const token = jwt.sign(
        { MaNguoiDung: user.MaNguoiDung, VaiTro: user.VaiTro },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({
        MaNguoiDung: user.MaNguoiDung,
        TenNguoiDung: user.TenNguoiDung,
        Email: user.Email,
        SoDienThoai: user.SoDienThoai,
        VaiTro: user.VaiTro,
        token: token,
      });
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).send('Lỗi server khi đăng nhập');
    }
  });

  // Cập nhật người dùng
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { TenNguoiDung, SoDienThoai, Email, MatKhau, VaiTro } = req.body;
    try {
      let updateQuery = `
        UPDATE dbo.NguoiDung
        SET 
          TenNguoiDung = @TenNguoiDung,
          SoDienThoai = @SoDienThoai,
          Email = @Email,
          VaiTro = @VaiTro
        WHERE MaNguoiDung = @MaNguoiDung
      `;
      const request = pool.request()
        .input('MaNguoiDung', sql.Int, id)
        .input('TenNguoiDung', sql.VarChar, TenNguoiDung)
        .input('SoDienThoai', sql.VarChar, SoDienThoai)
        .input('Email', sql.VarChar, Email)
        .input('VaiTro', sql.VarChar, VaiTro);
      if (MatKhau) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(MatKhau, salt);
        request.input('MatKhau', sql.VarChar, hashedPassword);
        updateQuery = updateQuery.replace('VaiTro = @VaiTro', 'MatKhau = @MatKhau, VaiTro = @VaiTro');
      }
      const result = await request.query(updateQuery);
      if (result.rowsAffected[0] > 0) {
        res.send('Cập nhật người dùng thành công');
      } else {
        res.status(404).send('Không tìm thấy người dùng');
      }
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).send('Lỗi server khi cập nhật người dùng');
    }
  });

  // Xóa người dùng
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.request()
        .input('MaNguoiDung', sql.Int, id)
        .query('DELETE FROM dbo.NguoiDung WHERE MaNguoiDung = @MaNguoiDung');
      if (result.rowsAffected[0] > 0) {
        res.send('Xóa người dùng thành công');
      } else {
        res.status(404).send('Không tìm thấy người dùng');
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).send('Lỗi server khi xóa người dùng');
    }
  });

  // Route gửi mã xác nhận qua email
  router.post('/forgot-password', async (req, res) => {
    const { Email } = req.body;
    if (!Email) {
      return res.status(400).send('Email là bắt buộc');
    }
    try {
      const result = await pool.request()
        .input('Email', sql.VarChar, Email)
        .query('SELECT * FROM dbo.NguoiDung WHERE Email = @Email');
      if (result.recordset.length === 0) {
        return res.status(404).send('Email không tồn tại');
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      resetCodes[Email] = { code, expiresAt: Date.now() + 10 * 60 * 1000 };
      const mailOptions = {
        from: 'nguyendanh9991@gmail.com',
        to: Email,
        subject: 'Mã xác nhận để đặt lại mật khẩu',
        text: `Mã xác nhận của bạn là: ${code}. Mã này có hiệu lực trong 10 phút.`,
      };
      await transporter.sendMail(mailOptions);
      res.status(200).send('Mã xác nhận đã được gửi đến email của bạn');
    } catch (err) {
      console.error('Lỗi khi gửi mã xác nhận:', err);
      res.status(500).send('Lỗi server khi gửi mã xác nhận');
    }
  });

  // Route đặt lại mật khẩu
  router.post('/reset-password', async (req, res) => {
    const { Email, Code, MatKhauMoi } = req.body;
    if (!Email || !Code || !MatKhauMoi) {
      return res.status(400).send('Email, mã xác nhận và mật khẩu mới là bắt buộc');
    }
    try {
      const storedCode = resetCodes[Email];
      if (!storedCode || storedCode.expiresAt < Date.now() || storedCode.code !== Code) {
        delete resetCodes[Email];
        return res.status(400).send('Mã xác nhận không đúng hoặc đã hết hạn');
      }
      delete resetCodes[Email];
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(MatKhauMoi, salt);
      const result = await pool.request()
        .input('Email', sql.VarChar, Email)
        .input('MatKhauMoi', sql.VarChar, hashedPassword)
        .query('UPDATE dbo.NguoiDung SET MatKhau = @MatKhauMoi WHERE Email = @Email');
      if (result.rowsAffected[0] === 0) {
        return res.status(404).send('Email không tồn tại');
      }
      res.status(200).send('Đổi mật khẩu thành công');
    } catch (err) {
      console.error('Lỗi khi đặt lại mật khẩu:', err);
      res.status(500).send('Lỗi server khi đặt lại mật khẩu');
    }
  });

  return router;
};