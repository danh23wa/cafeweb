import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để điều hướng
import 'bootstrap/dist/css/bootstrap.min.css';
import './signup.css';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [formData, setFormData] = useState({
    TenNguoiDung: '',
    Email: '',
    MatKhau: '',
    XacNhanMatKhau: '',
    SoDienThoai: '',
    VaiTro: 'KhachHang',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, VaiTro: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.MatKhau !== formData.XacNhanMatKhau) {
      setError(t('passwordMismatch')); // Key: "Mật khẩu không khớp"
      setLoading(false);
      return;
    }

    const apiEndpoint = 'http://localhost:3000/api/auth/register';

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          TenNguoiDung: formData.TenNguoiDung,
          Email: formData.Email,
          MatKhau: formData.MatKhau,
          SoDienThoai: formData.SoDienThoai,
          VaiTro: formData.VaiTro,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || t('signupFailed')); // Key: "Đăng ký thất bại"
      }

      const result = await response.json();
      setSuccess(t('signupSuccess')); // Key: "Đăng ký thành công"
      setFormData({
        TenNguoiDung: '',
        Email: '',
        MatKhau: '',
        XacNhanMatKhau: '',
        SoDienThoai: '',
        VaiTro: 'KhachHang',
      });
      setTimeout(() => navigate('/login'), 2000); // Chuyển hướng về trang đăng nhập sau 2 giây
    } catch (error) {
      setError(error.message || t('signupError')); // Key: "Lỗi đăng ký"
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page d-flex justify-content-center align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 d-none d-md-block image-container">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=550&h=550&q=80"
              alt="Signup Image"
              className="img-fluid"
            />
          </div>
          <div className="col-md-5">
            <div className="signup-card p-4 shadow-lg">
              <h2 className="text-center mb-4">{t('signupTitle')}</h2>

              {error && <div className="alert alert-danger text-center">{error}</div>}
              {success && <div className="alert alert-success text-center">{success}</div>}
              {loading && <div className="alert alert-info text-center">{t('processing')}</div>} {/* Key: "Đang xử lý" */}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    id="TenNguoiDung"
                    className="form-control signup-input"
                    placeholder={t('enterFullName')}
                    value={formData.TenNguoiDung}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    id="Email"
                    className="form-control signup-input"
                    placeholder={t('enterEmail')}
                    value={formData.Email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    id="MatKhau"
                    className="form-control signup-input"
                    placeholder={t('password')}
                    value={formData.MatKhau}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    id="XacNhanMatKhau"
                    className="form-control signup-input"
                    placeholder={t('enterConfirmPassword')}
                    value={formData.XacNhanMatKhau}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="tel"
                    id="SoDienThoai"
                    className="form-control signup-input"
                    placeholder={t('enterPhoneNumber')}
                    value={formData.SoDienThoai}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="VaiTro" className="form-label">{t('role')}:</label>
                  <select
                    id="VaiTro"
                    className="form-select signup-input"
                    value={formData.VaiTro}
                    onChange={handleRoleChange}
                    disabled={loading}
                  >
                    <option value="KhachHang">{t('customer')}</option>
                    <option value="Admin">{t('admin')}</option>
                  </select>
                </div>
                <button type="submit" className="btn signup-btn w-100" disabled={loading}>
                  {loading ? t('signingUp') : t('signupTitle')} {/* Key: "Đang đăng ký" */}
                </button>
              </form>
              <div className="mt-3 text-center">
                <span>{t('haveAccount')}</span>{' '}
                <a href="/login" className="text-link">{t('loginLink')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;