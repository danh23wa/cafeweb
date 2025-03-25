const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const sql = require('mssql');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const generateToken = (user) => jwt.sign({ id: user.MaNguoiDung, email: user.Email }, JWT_SECRET, { expiresIn: '1h' });

module.exports = (pool, app) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          console.log(`Google Login: ${email}`);
          const result = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT * FROM dbo.NguoiDung WHERE Email = @Email');
          let user = result.recordset[0];
          if (!user) {
            console.log(`Tạo tài khoản mới cho ${email}`);
            const insertResult = await pool.request()
              .input('Email', sql.VarChar, email)
              .input('TenNguoiDung', sql.NVarChar, profile.displayName || 'Unknown')
              .input('MatKhau', sql.VarChar, '')
              .input('VaiTro', sql.VarChar, 'User')
              .input('Provider', sql.VarChar, 'Google')
              .input('ProviderID', sql.VarChar, profile.id)
              .input('SoDienThoai', sql.VarChar, null)
              .query(`
                INSERT INTO dbo.NguoiDung (Email, TenNguoiDung, SoDienThoai, MatKhau, VaiTro, Provider, ProviderID)
                OUTPUT INSERTED.*
                VALUES (@Email, @TenNguoiDung, @SoDienThoai, @MatKhau, @VaiTro, @Provider, @ProviderID)
              `);
            user = insertResult.recordset[0];
          }
          return done(null, { user, token: generateToken(user) });
        } catch (err) {
          console.error('Lỗi Google Strategy:', err);
          return done(err, null);
        }
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/github/callback',
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
          console.log(`GitHub Login: ${email}`);
          const result = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT * FROM dbo.NguoiDung WHERE Email = @Email');
          let user = result.recordset[0];
          if (!user) {
            console.log(`Tạo tài khoản mới cho ${email}`);
            const insertResult = await pool.request()
              .input('Email', sql.VarChar, email)
              .input('TenNguoiDung', sql.NVarChar, profile.displayName || profile.username || 'Unknown')
              .input('MatKhau', sql.VarChar, '')
              .input('VaiTro', sql.VarChar, 'KhachHang')
              .input('Provider', sql.VarChar, 'GitHub')
              .input('ProviderID', sql.VarChar, profile.id)
              .input('SoDienThoai', sql.VarChar, null)
              .query(`
                INSERT INTO dbo.NguoiDung (Email, TenNguoiDung, SoDienThoai, MatKhau, VaiTro, Provider, ProviderID)
                OUTPUT INSERTED.*
                VALUES (@Email, @TenNguoiDung, @SoDienThoai, @MatKhau, @VaiTro, @Provider, @ProviderID)
              `);
            user = insertResult.recordset[0];
          }
          return done(null, { user, token: generateToken(user) });
        } catch (err) {
          console.error('Lỗi GitHub Strategy:', err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    (req, res) => {
      const { token, user } = req.user;
      // Trả token qua query string thay vì cookie
      res.redirect(`http://localhost:5173/login?token=${token}`);
    }
  );

  app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
  app.get('/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/' }),
    (req, res) => {
      const { token, user } = req.user;
      // Trả token qua query string thay vì cookie
      res.redirect(`http://localhost:5173/login?token=${token}`);
     

    }
  );
};