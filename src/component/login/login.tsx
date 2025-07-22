import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

const LoginPage = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleGitHubCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const provider = params.get('provider');

      if (token && provider === 'github') {
        setLoading(true);
        try {
          // Gửi token đến backend để lấy thông tin user
          const response = await axios.get('http://localhost:3000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = response.data.data;
          if (!user) throw new Error(t('noUserInfo'));

          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          if (onLoginSuccess) onLoginSuccess(user);
          setSuccess(t('loginSuccess'));
          setTimeout(() => navigate('/'), 1500);
        } catch (err) {
          console.error('GitHub login error:', err.response?.data || err.message);
          setError(t('githubLoginError'));
        } finally {
          setLoading(false);
        }
      }
    };

    const checkLoginStatus = async () => {
      if (location.state?.justLoggedOut) {
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data.data;
        if (!user) throw new Error(t('noUserInfo'));
        localStorage.setItem('user', JSON.stringify(user));
        if (onLoginSuccess) onLoginSuccess(user);
        setSuccess(t('loginSuccess'));
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        console.error('Error checking login status:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    handleGitHubCallback();
    if (!location.search.includes('token')) checkLoginStatus();
  }, [navigate, onLoginSuccess, t, location.search, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, MatKhau: matKhau }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('loginFailed'));
      }

      const result = await response.json();
      // Đảm bảo lấy đúng result.data
      localStorage.setItem('user', JSON.stringify(result.data));
      localStorage.setItem('token', result.data.token);
      if (onLoginSuccess) onLoginSuccess(result.data);
      setSuccess(t('loginSuccess'));
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setError(error.message || t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const user = {
          Email: userInfo.data.email,
          TenNguoiDung: userInfo.data.name || 'Unknown',
          Provider: 'Google',
          ProviderID: userInfo.data.sub,
        };

        const res = await axios.post('http://localhost:3000/api/auth/google-login', user, {
          withCredentials: true,
        });
        const { data: userFromBackend } = res.data;

        localStorage.setItem('user', JSON.stringify(userFromBackend));
        localStorage.setItem('token', userFromBackend.token);
        if (onLoginSuccess) onLoginSuccess(userFromBackend);
        setSuccess(t('loginSuccess'));
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        setError(t('googleLoginError') + (err.response?.data?.error || err.message));
      }
    },
    onError: () => setError(t('googleLoginFailed')),
  });

  const githubLogin = () => {
    window.location.href = 'http://localhost:3000/auth/github';
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      googleLogout();
      setSuccess(t('logoutSuccess'));
      navigate('/login', { state: { justLoggedOut: true } });
    } catch (err) {
      console.error('Lỗi đăng xuất:', err);
      setError(t('logoutError'));
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 d-none d-md-block image-container">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=550&h=550&q=80"
              alt="Login Image"
              className="img-fluid"
            />
          </div>
          <div className="col-md-5">
            <div className="login-card p-4 shadow-lg">
              <h2 className="text-center mb-4">{t('loginTitle')}</h2>
              {error && <div className="alert alert-danger text-center">{error}</div>}
              {success && <div className="alert alert-success text-center">{success}</div>}
              {loading && <div className="alert alert-info text-center">{t('processing')}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control login-input"
                    placeholder={t('enterEmail')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    className="form-control login-input"
                    placeholder={t('enterPassword')}
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="btn login-btn w-100" disabled={loading}>
                  {loading ? t('loggingIn') : t('login')}
                </button>
              </form>
              <div className="d-flex justify-content-between mt-3">
                <Link to="/forgot-password" className="text-link">{t('forgotPassword')}</Link>
                <Link to="/signup" className="text-link">{t('signupLink')}</Link>
              </div>
              <div className="mt-4 text-center text-muted">{t('orLoginWith')}</div>
              <div className="d-flex justify-content-center mt-3 gap-3">
                <button
                  onClick={() => googleLogin()}
                  disabled={loading}
                  className="btn social-btn google-btn d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="fab fa-google"></i> Google
                </button>
                <button
                  onClick={githubLogin}
                  disabled={loading}
                  className="btn social-btn github-btn d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="fab fa-github"></i> GitHub
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;