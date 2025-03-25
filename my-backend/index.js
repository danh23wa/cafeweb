require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { Translate } = require('@google-cloud/translate').v2;

// Import các route
const nguoiDungRoute = require('./routes/NguoiDung');
const sanPhamRoute = require('./routes/SanPham');
const donHangRoute = require('./routes/DonHang');
const gioHangRoute = require('./routes/GioHang');
const thanhToanRoute = require('./routes/ThanhToan');
const loaiSanPhamRoute = require('./routes/LoaiSanPham');
const chiTietHoaDonRoute = require('./routes/ChiTietHoaDon');
const tinTucRoute = require('./routes/TinTuc');
const chiTietTinTucRoute = require('./routes/ChiTietTinTuc');
const cuaHangRoute = require('./routes/CuaHang');

const app = express();
const port = process.env.PORT || 3000;

// Khởi tạo Google Translate
const translate = new Translate({ key: process.env.GOOGLE_API_KEY });
console.log('Using API Key:', process.env.GOOGLE_API_KEY || 'Hardcoded key');

// Cấu hình CORS
const corsOptions = {
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:3001',
    'http://localhost:5173',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'], // Đảm bảo header Authorization được phép
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Cấu hình session cho Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình SQL Server
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
  },
};

// Hàm dịch văn bản
const translateText = async (text, targetLang) => {
  if (targetLang === 'vi' || !text) return text;
  try {
    const [translation] = await translate.translate(text, targetLang);
    return translation;
  } catch (error) {
    console.error(`Error translating "${text}" to ${targetLang}:`, error);
    return text;
  }
};

// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Kết nối đến SQL Server và khởi động server
const startServer = async () => {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');

    // Cấu hình Passport
    require('./passport')(pool, app);

    // Endpoint /api/nguoidung/me
    app.get('/api/nguoidung/me', async (req, res) => {
      
      const token = req.headers['authorization']?.split('Bearer ')[1]; // Dùng chữ thường để chắc chắn
    
      if (!token) return res.status(401).json({ message: 'Không có token' });

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        const result = await pool.request()
          .input('MaNguoiDung', sql.Int, decoded.id)
          .query('SELECT * FROM dbo.NguoiDung WHERE MaNguoiDung = @MaNguoiDung');
        const user = result.recordset[0];
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.json({ user });
      } catch (err) {
        console.error('Lỗi /me:', err);
        res.status(401).json({ message: 'Token không hợp lệ' });
      }
    });

    // Endpoint đăng xuất
    app.post('/api/nguoidung/logout', (req, res) => {
      res.status(200).json({ message: 'Đăng xuất thành công' });
    });

    // Endpoint xử lý Google login
    app.post('/api/nguoidung/google-login', async (req, res) => {
      const { Email, TenNguoiDung, Provider, ProviderID } = req.body;
      if (!Email || !ProviderID) {
        return res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
      }

      try {
        const result = await pool.request()
          .input('Email', sql.VarChar, Email)
          .query('SELECT * FROM dbo.NguoiDung WHERE Email = @Email');
        let user = result.recordset[0];

        if (!user) {
          console.log(`Tạo tài khoản mới cho ${Email}`);
          const insertResult = await pool.request()
            .input('Email', sql.VarChar, Email)
            .input('TenNguoiDung', sql.NVarChar, TenNguoiDung || 'Unknown')
            .input('MatKhau', sql.VarChar, '')
            .input('VaiTro', sql.VarChar, 'User')
            .input('Provider', sql.VarChar, Provider)
            .input('ProviderID', sql.VarChar, ProviderID)
            .input('SoDienThoai', sql.VarChar, null)
            .query(`
              INSERT INTO dbo.NguoiDung (Email, TenNguoiDung, SoDienThoai, MatKhau, VaiTro, Provider, ProviderID)
              OUTPUT INSERTED.*
              VALUES (@Email, @TenNguoiDung, @SoDienThoai, @MatKhau, @VaiTro, @Provider, @ProviderID)
            `);
          user = insertResult.recordset[0];
        }

        const token = jwt.sign({ id: user.MaNguoiDung, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ user, token });
      } catch (err) {
        console.error('Lỗi Google Login:', err);
        res.status(500).json({ error: 'Lỗi khi xử lý đăng nhập Google' });
      }
    });

    // Các route khác
    app.use('/api/nguoidung', nguoiDungRoute(pool, translateText));
    app.use('/api/stores', cuaHangRoute(pool, translateText));
    app.use('/api/sanpham', sanPhamRoute(pool, translateText));
    app.use('/api/donhang', donHangRoute(pool, translateText));
    app.use('/api/giohang', gioHangRoute(pool, translateText));
    app.use('/api/thanhtoan', thanhToanRoute(pool, translateText));
    app.use('/api/loaisanpham', loaiSanPhamRoute(pool, translateText));
    app.use('/api/chitiethoadon', chiTietHoaDonRoute(pool, translateText));
    app.use('/api/tintuc', tinTucRoute(pool, translateText));
    app.use('/api/chitiettintuc', chiTietTinTucRoute(pool, translateText));

    // Khởi động server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server: ', err);
    process.exit(1);
  }
};

startServer();